import { Box, Card, Display, ProgressCard, colors, toast } from '@impact-market/ui';
import { useState, useContext } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import { MetricsWrapper, RewardsButton } from './Styles';
import { DataContext } from '../../context/DataContext';
import useLearnAndEarn from '../../hooks/useLearnAndEarn';
import { useAccount } from 'wagmi';

const Metrics = (props: any) => {
    const { metrics } = props;
    const { token }: any = useContext(DataContext);
    const {
        amount = false,
        levelId = false,
        signature: signatures = false
    } = metrics?.claimRewards?.[0] || {};
    const { claimRewardForLevels } = useLearnAndEarn();
    const { address } = useAccount();
    const [isLoading, setIsLoading] = useState(false);

    const totalData = [
        { ...metrics?.level, label: 'Levels Completed' },
        { ...metrics?.lesson, label: 'Lessons Completed' }
    ];

    const hasRewards = amount && levelId && signatures;
    const disabled = hasRewards ? { bgS400: true } : {};

    const claimRewards = async () => {
        setIsLoading(true);
        let response;
        const metricsClaimRewards = metrics?.claimRewards;
        const {
            amount = 0,
            levelId = 0,
            signature: signatures = false
        } = metricsClaimRewards?.[0] || {};

        try {
            response = await claimRewardForLevels(
                address || '0x0',
                [levelId],
                [parseInt(amount)],
                [signatures]
            );
        } catch (error) {
            setIsLoading(false);
            // processTransactionError(error, 'claim_lae_rewards');
            console.log(error);
            toast.error('An error has occurred');
            throw Error;
        }

        const { transactionHash } = response;

        await fetch(`${import.meta.env.VITE_API_URL}/learn-and-earn/levels`, {
            body: JSON.stringify({
                transactionHash
            }),
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        });

        toast.success(`You've successfully claimed your rewards.`);
        setIsLoading(false);
    };

    return (
        <MetricsWrapper>
            {totalData.map((item) => (
                <ProgressCard
                    label={item.label}
                    progress={(item?.completed / item?.total) * 100}
                    pathColor="p600"
                    style={{ flex: '1' }}
                    className="stats"
                >
                    <Display>
                        {`${item?.completed ?? item?.received} `}
                        <span
                            style={{
                                fontWeight: 600
                            }}
                        >
                            {'of'}
                        </span>
                        {` ${item?.total}`}
                    </Display>
                </ProgressCard>
            ))}
            {hasRewards && (
                <Card
                    className="claim-rewards"
                    style={{ boxSizing: 'border-box', flex: '1' }}
                >
                    <Box
                        style={{
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <RichText
                            style={{color: `${colors.g500}`}}
                            content={
                                hasRewards
                                    ? props.copy.success
                                    : props.copy.failed
                            }
                        />
                        <RewardsButton
                            onClick={claimRewards}
                            {...disabled}
                            disabled={!hasRewards}
                            isLoading={isLoading}
                        >
                            {/* <String id="claimRewards" /> */}
                            {'Claim Rewards'}
                        </RewardsButton>
                    </Box>
                </Card>
            )}
        </MetricsWrapper>
    );
};

export default Metrics;
