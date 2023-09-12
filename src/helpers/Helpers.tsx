// import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
// import Message from '../libs/Prismic/components/Message';
// import React from 'react';
import RichText from '../libs/Prismic/components/RichText';
// import String from '../libs/Prismic/components/String';

export const ctaText = (status: string, reward: number, earnRewardsCopy: any) => {
    // const { view } = usePrismicData();
    // const { earnRewards } = view.data;
    // console.log(earnRewardsCopy);

    switch (status) {
        case 'available':
            // return isLAEUser ? (
            //     <RichText content={earnRewards} medium variables={{ reward }} />
            // ) : (
            //     <Message id="viewLessons" />
            // );


            // return <Message id="viewLessons" />
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
