import {
    Box,
    Card,
    Display,
    ProgressCard,
    Text,
    colors,
    toast
} from '@impact-market/ui';
import { DataContext } from '../../context/DataContext';
import { MetricsWrapper, RewardsButton } from './Styles';
import { toToken } from '@impact-market/utils/toToken';
import { useAccount, useBalance } from 'wagmi';
import { useState, useContext } from 'react';
import processTransactionError from '../../utils/processTransactionError';
import RichText from '../../libs/Prismic/components/RichText';
import useLearnAndEarn from '../../hooks/useLearnAndEarn';

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

        try {
            const response = (await claimRewardForLevels(
                address || '0x0',
                [levelId],
                [toToken(amount)],
                [signatures]
            )) as { hash?: string };

            const { hash } = response;

            await fetch(
                `${import.meta.env.VITE_API_URL}/learn-and-earn/levels`,
                {
                    body: JSON.stringify({
                        transactionHash: hash
                    }),
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    method: 'PUT'
                }
            );

            toast.success(`You've successfully claimed your rewards.`);
            setIsLoading(false);
        } catch (error: any) {
            setIsLoading(false);
            processTransactionError(error, 'claim_lae_rewards');
            console.log(error);

            if (error.toString().includes('insufficient')) {
                toast.error(
                    'Insufficient funds in your wallet to claim rewards.'
                );
            } else {
                toast.error('An error has occurred');
            }

            throw error;
        }
    };

    const balance = useBalance({
        address,
        token: import.meta.env.VITE_PACT_ADDRESS
    })?.data;

    return (
        <MetricsWrapper>
            {totalData.map((item) => (
                <ProgressCard
                    key={item.label}
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
                        style={{ color: `${colors.g500}` }}
                        content={
                            hasRewards ? props.copy.success : props.copy.failed
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
                    <Text
                        small
                        style={{ marginTop: '.5rem' }}
                    >{`You have ${parseFloat(balance?.formatted || '0').toFixed(
                        0
                    )} PACT.`}</Text>
                </Box>
            </Card>
        </MetricsWrapper>
    );
};

export default Metrics;
