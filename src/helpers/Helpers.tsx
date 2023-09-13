import RichText from '../libs/Prismic/components/RichText';

export const ctaText = (status: string, reward: number, earnRewardsCopy: any) => {
    switch (status) {
        case 'available':
            return <RichText content={earnRewardsCopy} medium variables={{ reward }} />

        case 'started':
            // return <String id="continue" />;
            return 'Continue';
        case 'completed':
            // return <Message id="viewLessons" />;
            return 'View Lessons'
        default:
            return '';
    }
};

export const extractLessonIds = (level: any) => level?.data?.lessons?.map(
    (current: any) => current.lesson.id
);
