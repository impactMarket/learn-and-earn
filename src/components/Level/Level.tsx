import { Alert, Box, Divider, Icon, Label } from '@impact-market/ui';
import { Badge, Button, BackButton, Display, Text } from '../../Theme';
import { cardData } from './CertificateData';
import { DataContext } from '../../context/DataContext';
import { extractLessonIds } from '../../helpers/Helpers';
import { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GenerateCertificate from '../Common/GenerateCertificate';
import Prismic from '../../helpers/Prismic';
import RichText from '../../libs/Prismic/components/RichText';
import styled from 'styled-components';
import Tooltip from '../Tooltip';
import useLessons from '../../hooks/useLessons';

const Cell = styled(Box)`
    display: flex;
    flex-direction: column;
    flex: none;
    justify-content: center;
`;

const AlertStyled = styled(Alert)`
    & > div > div {
        display: flex;
        gap: 1rem;
    }
`;

const Level = () => {
    const { view, categories, token, setIsLoading }: any =
        useContext(DataContext);

    const { levelId = '' } = useParams();
    const level = Prismic.getLevelByUID({ levelId });
    const lessonIds = !!level && extractLessonIds(level);
    const lessons = Prismic.getLessonsByIDs({ lessonIds });
    const navigate = useNavigate();
    const { title, category, sponsor, minimum } = level?.data || {};

    const {
        'threshold-tooltip': thresholdTooltip,
        'no-rewards-tooltip': noRewardsTooltip,
        'no-rewards-tooltip-title': noRewardsTooltipTitle,
        'message-pointsTotal': totalPointsLabel,
        'start-lesson': startLessonLabel
    } = view?.data ?? {
        instructions: '',
        'threshold-tooltip': [''],
        'only-beneficiaries-tooltip': '',
        'no-rewards-tooltip': '',
        'no-rewards-tooltip-title': '',
        'message-pointsTotal': '',
        'start-lesson': ''
    };

    const { text: tooltip } = thresholdTooltip[0];

    const {
        data: lessonsData,
        totalPoints,
        completedToday,
        rewardAvailable = true
    } = useLessons(lessons, level?.id, token);

    const certificateDetails = !!lessonsData && {
        ...cardData,
        title,
        sponsor: sponsor?.url,
        completionDate: lessonsData[lessonsData?.length - 1]?.completionDate
    };

    const startLesson = async (lessonId: number, uid: string) => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/learn-and-earn/lessons`,
                {
                    body: JSON.stringify({
                        lesson: lessonId
                    }),
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    method: 'POST'
                }
            );

            const response = await res.json();

            if (response?.success) {
                setIsLoading(true);
                navigate(`/${levelId}/${uid}?page=0`);
            } else {
                console.log('error');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const buttonDisabled = !completedToday;

    useEffect(() => {
        if (!!level && lessonsData?.some((lesson: any) => !!lesson.status)) {
            setIsLoading(false);
        }
    }, [level, lessonsData]);

    return (
        <>
            <BackButton as="a" onClick={() => navigate(`/`)}>
                <Label content={'Courses'} icon="arrowLeft" />
            </BackButton>

            {!rewardAvailable && (
                <Box mt="1rem">
                    <Alert
                        error
                        icon="alertCircle"
                        message={noRewardsTooltip}
                        title={noRewardsTooltipTitle}
                    />
                </Box>
            )}

            <Display>{title}</Display>

            {categories && (
                <RichText
                    className="sub-item"
                    content={categories[category?.id]?.title}
                />
            )}
            <Divider />

            <Box style={{ display: 'flex', justifyContent: 'center' }}>
                <Box style={{ maxWidth: '36.25rem' }}>
                    <Text>
                        {
                            'After each tutorial, you will be prompted to answer a quiz based on your learning. You will receive tokens for every successful quiz in your wallet.'
                        }
                    </Text>

                    {/* <Text bold>
                        {
                            'To qualify for rewards from this course, your balance must exceed 1 cUSD (Celo Dollar).'
                        }
                    </Text> */}

                    <Text>
                        {
                            'After 3 attempts to answer a quiz and the result is still wrong, you will not be able to earn rewards but will still be able to learn.'
                        }
                    </Text>

                    {minimum && (
                        <AlertStyled
                            warning
                            icon="alertTriangle"
                            title={minimum}
                        />
                    )}

                    {!!certificateDetails?.completionDate && (
                        <GenerateCertificate {...certificateDetails} />
                    )}

                    <Box margin="1rem 0">
                        <Text noMargin>
                            <RichText content={totalPointsLabel} small />
                        </Text>

                        <Display main>{totalPoints}</Display>
                    </Box>

                    <Divider mt="2rem" />

                    {lessonsData?.map((item: any, idx: number) => {
                        return (
                            <>
                                <Box
                                    style={{
                                        columnGap: '1rem',
                                        justifyContent: 'space-between',
                                        display: 'flex'
                                    }}
                                >
                                    <Box style={{ flexGrow: '1' }}>
                                        <RichText
                                            content={item.title.split(' -')[0]}
                                            bold
                                        />

                                        <RichText
                                            content={item.title.split('- ')[1]}
                                        />
                                    </Box>
                                    <Cell>
                                        {item.status === 'started' && (
                                            <Button
                                                fluid
                                                disabled={
                                                    (idx - 1 >= 0 &&
                                                        lessonsData[idx - 1]
                                                            ?.status !==
                                                            'completed') ||
                                                    completedToday
                                                }
                                                onClick={() => {
                                                    setIsLoading(true);
                                                    navigate(
                                                        `/${levelId}/${item.uid}?page=0`
                                                    );
                                                }}
                                            >
                                                {'Continue'}
                                            </Button>
                                        )}

                                        {item.status === 'available' &&
                                            (idx - 1 < 0 ||
                                                lessonsData[idx - 1]?.status ===
                                                    'completed') && (
                                                <Tooltip
                                                    content={tooltip}
                                                    disabledTooltip={
                                                        buttonDisabled
                                                    }
                                                >
                                                    <Button
                                                        fluid
                                                        disabled={
                                                            completedToday
                                                        }
                                                        onClick={() =>
                                                            startLesson(
                                                                item.id,
                                                                item.uid
                                                            )
                                                        }
                                                    >
                                                        {startLessonLabel}
                                                    </Button>
                                                </Tooltip>
                                            )}

                                        {item.status === 'completed' && (
                                            <Badge bgS50 s700>
                                                {'Completed'}
                                                <Icon icon="check" s700 />
                                            </Badge>
                                        )}
                                    </Cell>
                                </Box>
                                <Divider />
                            </>
                        );
                    })}
                </Box>
            </Box>
        </>
    );
};

export default Level;
