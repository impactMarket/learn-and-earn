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
import { useAccount } from 'wagmi';
import { useState, useContext } from 'react';
import processTransactionError from '../../utils/processTransactionError';
import RichText from '../../libs/Prismic/components/RichText';
import useLearnAndEarn from '../../hooks/useLearnAndEarn';

const Metrics = (props: any) => {
    const { metrics } = props;
    const { token, view }: any = useContext(DataContext);
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
    const completedAll = metrics?.level?.completed >= metrics?.level?.total;

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
                toast.error('An error has occurred.');
            }

            throw error;
        }
    };

    return (
        <MetricsWrapper>
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
                            hasRewards
                                ? props.copy.success
                                : completedAll
                                ? props.copy.completed
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
                    {/* <Text
                        small
                        style={{ marginTop: '.5rem' }}
                    >{`You have earned ${parseFloat(
                        balance?.formatted || '0'
                    ).toFixed(0)} PACT so far.`}</Text> */}
                    <Text small semibold style={{ marginTop: '1rem' }}>
                        <a
                            href={`mailto:external-issues-aaaamvozkp6sgugn64lldg5n64@ipctmarket.slack.com?subject=Learn%20and%20Earn%20-%20Opera&body=Please%20Describe%20Your%20Problem:%0A%0A%0A------------------------------%0A%0AYour%20Wallet%20Address:%0A${address}%0A%0AWe%20collected%20your%20wallet%20address%20to%20analyze%20and%20resolve%20reported%20bugs.%20Without%20this%20information%20it%20may%20be%20difficult%20to%20provide%20proper%20help.%20Your%20funds%20remain%20secure.`}
                            style={{
                                color: '#5A6FEF',
                                textDecoration: 'none'
                            }}
                        >
                            {view?.data['need-help']}
                        </a>
                    </Text>
                </Box>
            </Card>
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
        </MetricsWrapper>
    );
};

export default Metrics;
