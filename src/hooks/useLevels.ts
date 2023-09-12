import useSWR from 'swr';

export default function useLevels(levels: any, token?: string) {
    const fetcher = (url: string) =>
        fetch(import.meta.env.VITE_API_URL + url, {
            headers: { Authorization: `Bearer ${token}`, 'client-id': 2 } as any
        }).then((res) => res.json());

    const shouldCallUseSWR = !!token;

    const { data: apiData, error } = useSWR(
        shouldCallUseSWR ? '/learn-and-earn/levels?language=en' : null,
        fetcher
    );

    // const { data: apiData, error } = useSWR(`/learn-and-earn/levels?language=en`, fetcher);

    const formatedResponse =
        levels &&
        (levels.reduce((next: any, current: any) => {
            const { id, lang, data, alternate_languages, uid } = current;
            const { title, lessons, category } = data;

            const filteredLessons = lessons.filter((el: any) => !!el.lesson.id);

            return {
                ...next,
                [id]: {
                    alternate_languages,
                    category: category.id ?? '',
                    data,
                    lang,
                    lessons: filteredLessons,
                    title,
                    uid
                }
            };
        }, {}) as any);

    let data = [];

    // let data =
    //     formatedResponse &&
    //     Object.values(formatedResponse).map((item: any) => {
    //         return {
    //             ...item,
    //             id: null,
    //             status: 'available',
    //             totalLessons: item?.lessons?.length,
    //             totalReward: item?.data?.reward
    //         };
    //     });

    // if (!token) {
    //     return {
    //         data,
    //         levelsLoading: false
    //     };
    // }

    if (apiData?.success) {
        data = apiData?.data?.rows?.map((item: any) => {
            const levelData: {
                totalLessons: number;
                totalReward: number;
                status: string;
                id: string;
            } = item;
            let apiLevel;

            if (formatedResponse && formatedResponse[item.prismicId]) {
                apiLevel = formatedResponse[item.prismicId];
            }

            return apiLevel
                ? {
                      ...apiLevel,
                      ...levelData,
                      totalReward: item?.data?.reward
                  }
                : null;
        });
    }

    const finalLevels = !import.meta.env.VITE_TESTNET
        ? data.filter((item: any) => item?.data?.is_live)
        : data;
    const levelsLoading = !data && !error;

    return {
        data: finalLevels && finalLevels.filter((item: any) => item !== null),
        levelsLoading
    };
}
