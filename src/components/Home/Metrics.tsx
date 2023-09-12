import {
    Box,
    // Button,
    Card,
    Display,
    // Grid,
    ProgressCard,
    toast
} from '@impact-market/ui';
// import { selectCurrentUser } from '../../state/slices/auth';
// import { useLearnAndEarn } from '@impact-market/utils/useLearnAndEarn';
// import { useSelector } from 'react-redux';
import { useState, useContext } from 'react';
import Message from '../../libs/Prismic/components/Message';
import RichText from '../../libs/Prismic/components/RichText';
// import String from '../../libs/Prismic/components/String';
// import config from '../../../config';
// import processTransactionError from '../../utils/processTransactionError';
// import styled from 'styled-components';
// import useTranslations from '../../libs/Prismic/hooks/useTranslations';

import { MetricsWrapper, RewardsButton } from './Styles';
import { DataContext } from '../../context/DataContext';
import useLearnAndEarn from '../../hooks/useLearnAndEarn';
import { useAccount } from 'wagmi';

const Metrics = (props: any) => {
    const { metrics } = props;
    console.log(metrics);
    
    const { token }: any = useContext(DataContext);

    const {
        amount = false,
        levelId = false,
        signature: signatures = false
    } = metrics?.claimRewards?.[0] || {};

    // const auth = useSelector(selectCurrentUser);
    const { claimRewardForLevels } = useLearnAndEarn();
    const { address } = useAccount();
    const [isLoading, setIsLoading] = useState(false);
    // const { t } = useTranslations();

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
            toast.error(<Message id="errorOccurred" />);
            throw Error;
        }

        console.log(response);
        

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
                    <Display semibold>
                        {`${item?.completed ?? item?.received} `}
                        <span
                            style={{
                                fontWeight: 400
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
                            center
                            g500
                            medium
                            small
                            mb="1rem"
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
