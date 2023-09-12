import {
    Alert,
    // Badge,
    Box,
    // Button,
    // Display,
    Divider,
    Icon,
    Label,
    // ViewContainer
} from '@impact-market/ui';
// import { selectCurrentUser } from '../../../state/slices/auth';
// import { useRouter } from 'next/router';
// import { useSelector } from 'react-redux';
import RichText from '../../libs/Prismic/components/RichText';
// import String from '../../../libs/Prismic/components/String';
// import Tooltip from '../../../components/Tooltip';
// import config from '../../../../config';
import useLessons from '../../hooks/useLessons';
// import useTranslations from '../../../libs/Prismic/hooks/useTranslations';

import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
// import { usePrismicDocumentByUID, usePrismicDocumentsByIDs } from '@prismicio/react';
import Prismic from '../../helpers/Prismic';
import { extractLessonIds } from '../../helpers/Helpers';
import { useContext, useEffect } from 'react';
import { DataContext } from '../../context/DataContext';
import { Badge, Button, BackButton, Display, Text } from '../../Theme';

const Cell = styled(Box)`
    display: flex;
    flex-direction: column;
    flex: none;
    justify-content: center;
`;

const Level = () => {
    const { view, categories, token, setIsLoading }: any =
        useContext(DataContext);

    // const [isLoading, setIsLoading] = useState(true);

    const { levelId = '' } = useParams();
    const level = Prismic.getLevelByUID({ levelId });
    const lessonIds = !!level && extractLessonIds(level);
    const lessons = Prismic.getLessonsByIDs({ lessonIds });
    const navigate = useNavigate();

    // const { title, category } = level?.data;
    // console.log(lessons);

    // const view = data['view-learn-and-earn'];
    // const { level, lessons, categories } = prismic;

    const { title, category } = level?.data || {};

    // const { t } = useTranslations();
    const {
        // instructions,
        // 'threshold-tooltip': thresholdTooltip,
        // 'only-beneficiaries-tooltip': onlyBeneficiariesTooltip,
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

    // const { text: tooltip } = thresholdTooltip[0];

    // const auth = useSelector(selectCurrentUser);
    const {
        data: lessonsData,
        totalPoints,
        completedToday,
        rewardAvailable = true
    } = useLessons(lessons, level?.id, token);

    // console.log([lessonsData, totalPoints, completedToday, rewardAvailable]);

    // const router = useRouter();

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
                // router.push(`/${lang}/learn-and-earn/${params.level}/${uid}`);
                setIsLoading(true);
                navigate(`/${levelId}/${uid}?page=0`);
            } else {
                console.log('error');
            }
        } catch (error) {
            console.log(error);
        }
    };

    // const isLAEUSer = auth?.user?.roles?.some((r: string) =>
    //     ['beneficiary', 'manager'].includes(r)
    // );
    // const tooltipText = !isLAEUSer ? onlyBeneficiariesTooltip : tooltip;
    // const buttonDisabled = isLAEUSer && !completedToday;

    useEffect(() => {
        console.log(!!lessonsData);

        if (!!level && lessonsData?.some((lesson: any) => !!lesson.status)) {
            setIsLoading(false);
        }
    }, [level, lessonsData]);

    return (
        <>
            <BackButton as="a" onClick={() => navigate(`/`)}>
                {/* <Label content={<String id="back" />} icon="arrowLeft" /> */}
                <Label content={'Back'} icon="arrowLeft" />
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
                    g500
                />
            )}
            <Divider />

            <Box style={{ display: 'flex', justifyContent: 'center' }}>
                <Box style={{ maxWidth: '36.25rem' }}>
                    {/* <RichText content={instructions} g500 /> */}
                    <Text>
                        {
                            'After each tutorial you will be prompt to answer a simple quiz based on what you have learned.For every successful quiz, you will receive $PACT tokens in your Libera wallet.'
                        }
                    </Text>

                    <Text bold>
                        {
                            'To qualify for rewards from this course, your balance must exceed 1 cUSD (Celo Dollar).'
                        }
                    </Text>

                    <Text>
                        {
                            'After 3 attempts to answer a quiz and the result is still wrong, you will not be able to earn rewards but will still be able to learn.'
                        }
                    </Text>

                    <Box margin="1rem 0">
                        <Text g500 noMargin>
                            <RichText content={totalPointsLabel} small />
                        </Text>

                        <Display main medium>
                            {totalPoints}
                        </Display>
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
                                            g500
                                            bold
                                        />

                                        <RichText
                                            content={item.title.split('- ')[1]}
                                            g500
                                        />
                                    </Box>
                                    <Cell>
                                        {item.status === 'started' && (
                                            // <Tooltip
                                            //     content={tooltip}
                                            //     disabledTooltip={buttonDisabled}
                                            // >
                                            <Button
                                                fluid
                                                disabled={
                                                    (idx - 1 >= 0 &&
                                                        lessonsData[idx - 1]
                                                            ?.status !==
                                                            'completed') ||
                                                    completedToday
                                                }
                                                onClick={() =>
                                                    // router.push(
                                                    //     `/${lang}/learn-and-earn/${params.level}/${item.uid}`
                                                    // )
                                                    {
                                                        setIsLoading(true);
                                                        navigate(
                                                            `/${levelId}/${item.uid}?page=0`
                                                        );
                                                    }
                                                }
                                            >
                                                {/* <String id="continue" /> */}
                                                {'Continue'}
                                            </Button>
                                        )}

                                        {item.status === 'available' &&
                                            (idx - 1 < 0 ||
                                                lessonsData[idx - 1]?.status ===
                                                    'completed') && (
                                                // <Tooltip
                                                //     content={tooltipText}
                                                //     disabledTooltip={
                                                //         buttonDisabled
                                                //     }
                                                // >
                                                <Button
                                                    fluid
                                                    disabled={completedToday}
                                                    onClick={() =>
                                                        startLesson(
                                                            item.id,
                                                            item.uid
                                                        )
                                                    }
                                                >
                                                    {startLessonLabel}
                                                </Button>
                                                // </Tooltip>
                                            )}

                                        {item.status === 'completed' && (
                                            <Badge bgS50 s700>
                                                {'Completed'}
                                                <Icon icon="check" s700 />
                                            </Badge>
                                        )}

                                        {/* TEST */}
                                        {/* <Badge bgS50 s700>
                                            {'Completed'}
                                            <Icon icon="check" s700 />
                                        </Badge> */}

                                        {/* <Button
                                            fluid
                                            // disabled={
                                            //     completedToday || !isLAEUSer
                                            // }
                                            onClick={() =>
                                                startLesson(item.id, item.uid)
                                            }
                                        >
                                            {startLessonLabel}
                                        </Button> */}
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
