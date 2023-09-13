/* eslint-disable */
import {
    usePrismicDocumentByUID,
    usePrismicDocumentsByIDs
} from '@prismicio/react';

const Prismic = {
    getLessonByUID: ({
        // lang: langCode = defaultLang,
        lessonUid = ''
    }: any) => {
        try {
            const [response] = usePrismicDocumentByUID(
                'pwa-lae-lesson',
                lessonUid
            ) as any;

            const { alternate_languages, data, id, lang, uid } = response;

            return { alternate_languages, ...data, id, lang, uid };
        } catch (error) {
            return null;
        }
    },
    getLessonsByIDs: ({ lessonIds = [] }: any) => {
        try {
            const [response] = usePrismicDocumentsByIDs(lessonIds);

            const lessonsData = response?.results?.map((item: any) => {
                const { uid, alternate_languages, lang, id } = item;
                const { title } = item.data;

                return { alternate_languages, id, lang, title, uid };
            });

            return lessonsData;
        } catch (error) {
            return null;
        }
    },
    getLevelByUID: ({ levelId = '' }: any) => {
        try {
            const [response] = usePrismicDocumentByUID(
                'pwa-lae-level',
                levelId
            ) as any;

            const {
                alternate_languages,
                data,
                id,
                lang: langDocument,
                uid
            } = response ?? {};

            const filteredLessons = data?.lessons?.filter((el: any) => {
                return !!el.lesson.id;
            });

            return {
                alternate_languages,
                data: { ...data, lessons: filteredLessons },
                id,
                lang: langDocument,
                uid
            };
        } catch (error) {
            console.log(error);

            return null;
        }
    }
};

export default Prismic;
