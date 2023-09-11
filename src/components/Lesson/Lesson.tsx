import {
    Box,
    // Button,
    Display,
    Divider,
    Label,
    OptionItem,
    Pagination,
    Text,
    ViewContainer,
    openModal,
    toast
} from '@impact-market/ui';
// import { selectCurrentUser } from '../../../state/slices/auth';
// import { usePrismicData } from '../../../libs/Prismic/components/PrismicDataProvider';
// import { useRouter } from 'next/router';
// import { useSelector } from 'react-redux';
import { useState } from 'react';
import Prismic from '../../helpers/Prismic';
// import Message from '../../../libs/Prismic/components/Message';
import RichText from '../../libs/Prismic/components/RichText';
// import String from '../../../libs/Prismic/components/String';
// import Video from '../Video';
// import config from '../../../../config';
// import useFilters from '../../../hooks/useFilters';
// import useTranslations from '../../../libs/Prismic/hooks/useTranslations';

import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { Button, BackButton } from '../../Theme';

const initialAnswers = [
    [false, false, false],
    [false, false, false],
    [false, false, false]
];

const QUIZ_LENGTH = 3;

const Lesson = (props: any) => {
    // const { prismic, lang, params } = props;
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParams = queryString.parse(location.search);
    const { page } = queryParams;
    console.log(searchParams);
    // debugger
    const navigate = useNavigate();

    // const { prismicLesson } = prismic;
    const { levelId = '', uid: lessonUid = '' } = useParams();
    // console.log(uid);

    const prismicLesson = Prismic.getLessonByUID({ lessonUid });
    console.log(prismicLesson);
    // debugger

    const {
        tutorial: content,
        questions,
        sponsor,
        'read-time': readTime,
        id
    } = prismicLesson ?? {
        tutorial: '',
        questions: [],
        sponsor: '',
        readTime: '',
        id: ''
    };
    // console.log(content);

    // const { t } = useTranslations();
    const { view }: any = useContext(DataContext);
    // console.log(view);

    // const { viewLearnAndEarn } = usePrismicData().data as any;
    const {
        'start-quiz': startQuiz,
        'complete-content': completeContent,
        sponsored
    } = view?.data ?? {
        'start-quiz': '',
        'complete-content': '',
        sponsored: ''
    };

    // console.log(view);

    // console.log(startQuiz);
    // debugger

    // const { update, getByKey } = useFilters();

    // const [currentPage, setCurrentPage] = useState(
    //     getByKey('page') ? +getByKey('page') : 0
    // );
    const [currentPage, setCurrentPage] = useState(parseInt(page));

    const [isQuiz, setIsQuiz] = useState(false);
    // const auth = useSelector(selectCurrentUser);
    // const router = useRouter();
    const [progress, setProgress] = useState([currentPage]);
    const [userAnswers, setUserAnswers] = useState(initialAnswers);

    const canGotoQuiz = progress.length === content.length;

    const slide =
        content[currentPage]?.slice_type === 'video_section'
            ? content[currentPage] ?? {}
            : content[currentPage]?.primary?.content ?? {};

    const currentQuestion = questions[currentPage];

    //  Handle Pagination
    const handlePageClick = (event: any, direction?: number) => {
        const currentPage = page ?? (0 as any);
        let nextPage = currentPage;

        if (event.selected >= 0) {
            nextPage = event.selected;
        } else if (direction === 1 && currentPage > 0) {
            nextPage = +currentPage - 1;
        } else if (direction === 2 && currentPage <= content?.length) {
            nextPage = +currentPage + 1;
        }

        if (!isQuiz && ![...new Set(progress)].includes(nextPage)) {
            setProgress([...progress, nextPage]);
        }

        setCurrentPage(nextPage);
        setSearchParams({ page: nextPage });
    };

    const toggleQuiz = (isQuiz: boolean) => {
        setIsQuiz(isQuiz);
        setSearchParams({ page: '0' });
        setCurrentPage(0);
    };

    const ContentDisplay = (props: any) => {
        const { slide } = props;

        if (slide[0]?.type) {
            if (slide[0].type === 'image') {
                return <RichText content={slide} style={{ width: '100%', flex: 1 }} />;
            }

            return (
                <Box style={{ width: '100%', maxWidth: '36.25rem', flex: 1 }}>
                    <RichText content={slide} pb=".5rem" />
                </Box>
            );
        }
        // if (slide.slice_type === 'video_section') {
        //     return (
        //         <Box maxW="100%" flex style={{ justifyContent: 'center' }}>
        //             <Video {...slide} />
        //         </Box>
        //     );
        // }

        return <></>;
    };

    return (
        <Box style={{display: 'flex',
            flexDirection: 'column', height: '100%'}}>
            {!isQuiz && (
                <BackButton as="a" onClick={() => navigate(`/${levelId}`)}>
                    {/* <Label
                        content={<String id="back" />}
                        icon="arrowLeft"
                        mb="1rem"
                    /> */}
                    <Label content={'Back'} icon="arrowLeft" mb="1rem" />
                </BackButton>
            )}
            <Display g900 mb=".25rem">
                {prismicLesson?.title}
            </Display>

            <Box style={{ display: 'flex' }}>
                <RichText content={readTime} g500 small />
                <RichText content={` - ${sponsored} `} g500 small />

                <RichText content={sponsor} g500 small />
            </Box>

            <Divider />
            <Box
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    flexDirection: 'column',
                    flex: 1
                }}
            >
                {!isQuiz ? (
                    <ContentDisplay slide={slide} />
                ) : (
                    <Box
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            marginTop: '2.5rem',
                            maxWidth: '36.25rem',
                            width: '100%'
                        }}
                    >
                        <RichText
                            content={currentQuestion.primary.question[0].text}
                            g900
                            medium
                            pb="1rem"
                        />

                        {currentQuestion.items.map((item: any, idx: number) => {
                            const question = item.answer[0];
                            const temp = [...userAnswers];

                            return (
                                <Box
                                    onClick={() => {
                                        temp[currentPage] = [
                                            false,
                                            false,
                                            false
                                        ];
                                        temp[currentPage][idx] =
                                            !temp[currentPage][idx];
                                        setUserAnswers(temp);
                                    }}
                                    style={{ marginBottom: '.75rem' }}
                                >
                                    <OptionItem
                                        content={question.text}
                                        isActive={userAnswers[currentPage][idx]}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                )}

                {!isQuiz && currentPage + 1 === content.length && (
                    <Box mt="1rem">
                        <Button
                            disabled={!canGotoQuiz}
                            // fluid
                            secondary
                            // xl
                            onClick={() => toggleQuiz(true)}
                        >
                            <RichText content={startQuiz} />
                        </Button>
                    </Box>
                )}

                {!canGotoQuiz && currentPage + 1 === content.length && (
                    <Text pt="1rem" g500 small>
                        <RichText content={completeContent} />
                    </Text>
                )}

                {isQuiz && currentPage + 1 === QUIZ_LENGTH && (
                    <Box mt="1rem">
                        <Button
                            // fluid
                            secondary
                            // xl
                            disabled={!(progress.length == content.length)}
                            onClick={async () => {
                                // Post answers
                                // const answers = userAnswers
                                //     .reduce((next: any, current: any) => {
                                //         return [
                                //             current.findIndex((el: any) => el),
                                //             ...next
                                //         ];
                                //     }, [])
                                //     .reverse();
                                // const res = await fetch(
                                //     `${config.baseApiUrl}/learn-and-earn/lessons`,
                                //     {
                                //         body: JSON.stringify({
                                //             answers,
                                //             lesson: id
                                //         }),
                                //         headers: {
                                //             Accept: 'application/json',
                                //             Authorization: `Bearer ${auth.token}`,
                                //             'Content-Type': 'application/json'
                                //         },
                                //         method: 'PUT'
                                //     }
                                // );
                                // const response = await res.json();
                                // if (response?.data?.success === false) {
                                //     openModal('laeFailedLesson', {
                                //         attempts: response?.data?.attempts,
                                //         onClose: () => {
                                //             toggleQuiz(false);
                                //             setUserAnswers(initialAnswers);
                                //         }
                                //     });
                                // } else if (response?.data?.success) {
                                //     openModal('laeSuccessLesson', {
                                //         onClose: () =>
                                //             router.push(
                                //                 `/${lang}/learn-and-earn/${params.level}`
                                //             )
                                //     });
                                // } else {
                                //     toast.error(<Message id="errorOccurred" />);
                                // }
                            }}
                        >
                            {/* {t('submit')} */}
                            {'submit'}
                        </Button>
                    </Box>
                )}

                <Box style={{ width: '100%' }}>
                    <Divider />
                    <Box>
                        <Pagination
                            currentPage={currentPage}
                            handlePageClick={handlePageClick}
                            mt={2}
                            mobileText
                            nextIcon="arrowRight"
                            nextLabel={'next'}
                            pageCount={isQuiz ? QUIZ_LENGTH : content.length}
                            pb={2}
                            previousIcon="arrowLeft"
                            previousLabel={'previous'}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Lesson;
