import { Display, ProgressCard } from '@impact-market/ui';
import { DataContext } from '../../context/DataContext';
import { MetricsWrapper } from './Styles';
import { useContext } from 'react';
import ClaimRewards from './ClaimRewards';
import ValidateEmail from './ValidateEmail';

const Metrics = (props: any) => {
    const { metrics } = props;
    const { email }: any = useContext(DataContext);

    const totalData = [
        { ...metrics?.level, label: 'Levels Completed' },
        { ...metrics?.lesson, label: 'Lessons Completed' }
    ];

    return (
        <MetricsWrapper>
            {email?.validated ? (
                <ClaimRewards data={props} />
            ) : (
                <ValidateEmail />
            )}
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
