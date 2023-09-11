import { usePrismicDocumentByUID, usePrismicDocumentsByIDs } from '@prismicio/react';

const Prismic = {
    getLessonByUID: ({
        // clientOptions = {},
        // lang: langCode = defaultLang,
        lessonUid = ''
    }: any) => {
        // const locale = langConfig.find(
        //     ({ shortCode }) => shortCode === langCode
        // )?.code;
        // const api = await client(clientOptions);

        try {
            // const response = await api.getByUID('pwa-lae-lesson', lesson, {
            //     lang: locale
            // });
            const [response] = usePrismicDocumentByUID('pwa-lae-lesson',lessonUid) as any;

            console.log(lessonUid);
            

            const { alternate_languages, data, id, lang, uid } = response;

            return { alternate_languages, ...data, id, lang, uid };
        } catch (error) {
            return null;
        }
    },
    getLessonsByIDs: ({
        // lang: langCode = defaultLang,
        lessonIds = []
    }: any) => {
        // const lang = langConfig.find(
        //     ({ shortCode }) => shortCode === langCode
        // )?.code;
        // const lang = 'en-us';

        // const api = await client(clientOptions);
        

        try {
            const [response] = usePrismicDocumentsByIDs(lessonIds);
            // const response = await api.getByIDs(lessonIds, { lang });

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
    getLevelByUID: ({
        // clientOptions = {},
        // lang: langCode = defaultLang,
        levelId = ''
    }: any) => {
        // const lang = langConfig.find(
        //     ({ shortCode }) => shortCode === langCode
        // )?.code;

        // const api = await client(clientOptions);

        // console.log(slug);
        // debugger

        try {
            // const response = await api.getByUID('pwa-lae-level', level, {
            //     lang
            // });
            const [response] = usePrismicDocumentByUID('pwa-lae-level', levelId) as any;
            console.log(response);
            
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
}

export default Prismic