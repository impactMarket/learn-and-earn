// import Video from '../Video';
import {
    Box,
    CircledIcon,
    Col,
    Display,
    Divider,
    Label,
    OptionItem,
    Text,
    colors,
    toast
} from '@impact-market/ui';
import { Breakpoints } from '../Breakpoints';
import { Button, BackButton } from '../../Theme';
import { DataContext } from '../../context/DataContext';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSinglePrismicDocument } from '@prismicio/react';
import { useState, useEffect } from 'react';
import EnhancedPagination from '../Common/EnhancedPagination';
import Modal from '../../modals/Modal';
import Prismic from '../../helpers/Prismic';
import queryString from 'query-string';
import RichText from '../../libs/Prismic/components/RichText';
import processTransactionError from '../../utils/processTransactionError';

const initialAnswers = [
    [false, false, false],
    [false, false, false],
    [false, false, false]
];

const QUIZ_LENGTH = 3;

const Lesson = () => {
    const [modal] = useSinglePrismicDocument('pwa-modals');
    const [wrongModalOpen, setWrongModalOpen] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [desktopLayout, setDesktopLayout] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const {
        'lae-failed-lesson-description': failedDescription,
        'lae-failed-lesson-title': failedTitle,
        'lae-success-lesson-description': successDescription,
        'lae-success-lesson-title': succesTitle
    } = modal?.data ?? {
        'lae-failed-lesson-description': '',
        'lae-failed-lesson-title': '',
        'lae-success-lesson-description': '',
        'lae-success-lesson-title': ''
    };

    const location = useLocation();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParams = queryString.parse(location.search);
    const { page } = queryParams;
    const navigate = useNavigate();
    const { levelId = '', uid: lessonUid = '' } = useParams();
    const prismicLesson = Prismic.getLessonByUID({ lessonUid });

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

    const { view, setIsLoading, token }: any = useContext(DataContext);

    const {
        'start-quiz': startQuiz,
        'complete-content': completeContent,
        sponsored
    } = view?.data ?? {
        'start-quiz': '',
        'complete-content': '',
        sponsored: ''
    };

    const [currentPage, setCurrentPage] = useState(parseInt(page));

    const [isQuiz, setIsQuiz] = useState(false);
    const [progress, setProgress] = useState([currentPage]);
    const [userAnswers, setUserAnswers] = useState(initialAnswers);

    const canGotoQuiz = progress.length === content.length;

    const slide = prismicLesson
        ? content[currentPage]?.primary?.content ??
          content[currentPage]?.primary?.html
        : {};
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
                return <RichText content={slide} style={{ width: '100%' }} />;
            }

            return (
                <Box style={{ width: '100%', maxWidth: '36.25rem' }}>
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

    const postAnswers = async () => {
        // Post answers
        setIsSubmitting(true);
        const answers = userAnswers
            .reduce((next: any, current: any) => {
                return [current.findIndex((el: any) => el), ...next];
            }, [])
            .reverse();

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/learn-and-earn/lessons`,
                {
                    body: JSON.stringify({
                        answers,
                        lesson: id
                    }),
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    method: 'PUT'
                }
            );
            const response = await res.json();

            if (response?.data?.success === false) {
                setAttempts(response?.data?.attempts);
                setWrongModalOpen(true);
            } else if (response?.data?.success) {
                setSuccessModalOpen(true);
            } else {
                toast.error('An error has occurred');
                processTransactionError(
                    response?.error?.message,
                    'post_answers'
                );
                console.log('error');
            }
        } catch (error) {
            toast.error('An error has occurred');
            processTransactionError(error, 'post_answers');
            console.log('error');
        }

        setIsSubmitting(false);
    };

    useEffect(() => {
        if (!!view && slide?.length) {
            setIsLoading(false);
        }
    }, [view, slide]);

    useEffect(() => {
        const checkWindowSize = () => {
            if (window.innerWidth >= +Breakpoints.medium.slice(0, -2)) {
                setDesktopLayout(true);
            } else {
                setDesktopLayout(false);
            }
        };

        window.addEventListener('resize', checkWindowSize);

        checkWindowSize();

        return () => {
            window.removeEventListener('resize', checkWindowSize);
        };
    }, []);

    const attemptsNumber = attempts <= 3 ? (3 - attempts).toString() : '0';

    return (
        <Box
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
            {!isQuiz && (
                <BackButton
                    as="a"
                    onClick={() => {
                        setIsLoading(true);
                        navigate(`/${levelId}`);
                    }}
                >
                    <Label content={'Lessons'} icon="arrowLeft" mb="1rem" />
                </BackButton>
            )}
            <Display mb=".25rem">{prismicLesson?.title}</Display>

            <Box style={{ display: 'flex' }}>
                <RichText content={readTime} small />
                <RichText content={` - ${sponsored} `} small />

                <RichText content={sponsor} small />
            </Box>

            <Divider />
            <Box
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    flexDirection: 'column',
                    flex: 1,
                    paddingBottom: '3.5rem'
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
                            content={currentQuestion?.primary?.question[0]?.text}
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

                {!isQuiz &&
                    currentPage + 1 === content.length &&
                    desktopLayout && (
                        <Box style={{ marginTop: '1rem' }}>
                            <Button
                                disabled={!canGotoQuiz}
                                secondary
                                onClick={() => toggleQuiz(true)}
                            >
                                <RichText content={startQuiz} />
                            </Button>
                        </Box>
                    )}

                {!canGotoQuiz && currentPage + 1 === content.length && (
                    <Text pt="1rem" small>
                        <RichText content={completeContent} />
                    </Text>
                )}

                {isQuiz && currentPage + 1 === QUIZ_LENGTH && desktopLayout && (
                    <Box mt="1rem">
                        <Button
                            disabled={!(progress.length == content.length)}
                            onClick={postAnswers}
                            isLoading={isSubmitting}
                        >
                            {/* {t('submit')} */}
                            {'Submit'}
                        </Button>
                    </Box>
                )}

                <Modal isOpen={wrongModalOpen}>
                    <Box>
                        <Col>
                            <CircledIcon
                                icon="alertCircle"
                                large
                                style={{
                                    color: `${colors.e600}`,
                                    background: '#FEE4E2'
                                }}
                            />
                        </Col>
                    </Box>
                    <Box style={{ marginTop: '1.25rem' }}>
                        <RichText content={failedTitle} large g900 semibold />
                    </Box>
                    <Box style={{ marginTop: '1.25rem', marginBottom: '2rem' }}>
                        <RichText
                            content={failedDescription}
                            variables={{ attempts: attemptsNumber }}
                        />
                    </Box>
                    <Button
                        fluid
                        style={{
                            background: 'white',
                            color: '#344054',
                            borderColor: '#D0D5DD'
                        }}
                        onClick={() => {
                            toggleQuiz(false);
                            setUserAnswers(initialAnswers);
                            setWrongModalOpen(false);
                        }}
                        mt="2rem"
                    >
                        {'Continue'}
                    </Button>
                </Modal>

                <Modal isOpen={successModalOpen}>
                    <Box>
                        <Col>
                            <CircledIcon
                                icon="checkBold"
                                large
                                style={{
                                    color: `${colors.s700}`,
                                    background: '#D1FADF'
                                }}
                            />
                        </Col>
                    </Box>
                    <Box style={{ marginTop: '1.25rem' }}>
                        <RichText content={succesTitle} large g900 />
                    </Box>
                    <Box style={{ marginTop: '1.25rem', marginBottom: '2rem' }}>
                        <RichText content={successDescription} medium />
                    </Box>
                    <Button
                        fluid
                        style={{
                            background: 'white',
                            color: '#344054',
                            borderColor: '#D0D5DD'
                        }}
                        onClick={() => {
                            setIsLoading(true);
                            navigate(`/${levelId}`);
                        }}
                        mt="2rem"
                    >
                        {'Continue'}
                    </Button>
                </Modal>

                <Box style={{ width: '100%' }}>
                    <Divider />
                    <Box>
                        <EnhancedPagination
                            currentPage={currentPage}
                            handlePageClick={handlePageClick}
                            pageCount={isQuiz ? QUIZ_LENGTH : content.length}
                            goToQuiz={toggleQuiz}
                            isQuiz={isQuiz}
                            canGotoQuiz={canGotoQuiz}
                            postAnswers={postAnswers}
                            isLoading={isSubmitting}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Lesson;
