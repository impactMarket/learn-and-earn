import useSWR from 'swr';
// import { useContext } from 'react';
// import { DataContext } from '../context/DataContext';

export default function useLessons(lessons: any, levelId: any, token?: string) {
    // const { setIsLoading }: any = useContext(DataContext);
    // console.log({lessons, levelId, token});
    
    const fetcher = (url: string) =>
        fetch(import.meta.env.VITE_API_URL + url, {
            headers: { Authorization: `Bearer ${token}` }
        }).then((res) => res.json());

        const shouldCallUseSWR = !!token;

    // if (token) {
        const { data } = useSWR<
            {
                data: {
                    completedToday: boolean;
                    lessons: any[];
                    rewardAvailable: boolean;
                    totalPoints: number;
                };
            },
            string
        >(shouldCallUseSWR ? `/learn-and-earn/levels/${levelId}?language=en` : null, fetcher);

        const { completedToday = false } = data?.data ?? {};

        const mergedLessons = data?.data?.lessons?.map((item: any) => {
            const formattedLessons = lessons?.map((el: any) => {
                const ids = el.alternate_languages.reduce(
                    (next: any, profile: any) => {
                        return [...next, profile.id];
                    },
                    []
                );

                if ([...ids, el.id].find((it) => it === item.prismicId)) {
                    return { ...el, backendId: item.id, status: item.status };
                }
            });

            return formattedLessons?.filter((e: any) => e).pop();
        });
        
        // setIsLoading(false)

        return {
            completedToday,
            data:
                levelId && mergedLessons
                    ? mergedLessons?.filter((e: any) => e)
                    : lessons,
            rewardAvailable: data?.data?.rewardAvailable || true,
            totalPoints: data?.data?.totalPoints || 0
        };
    // }

    // return {
    //     completedToday: true,
    //     data: lessons,
    //     rewardAvailable: true,
    //     totalPoints: 0
    // };
}
