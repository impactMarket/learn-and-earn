import useSWR from 'swr';

export default function useLessons(lessons: any, levelId: any, token?: string) {
    const fetcher = (url: string) =>
        fetch(import.meta.env.VITE_API_URL + url, {
            headers: { Authorization: `Bearer ${token}` }
        }).then((res) => res.json());

    const shouldCallUseSWR = !!token;

    const { data } = useSWR<
        {
            data: {
                completedToday: boolean;
                completionDate: string;
                lessons: any[];
                rewardAvailable: boolean;
                totalPoints: number;
            };
        },
        string
    >(
        shouldCallUseSWR
            ? `/learn-and-earn/levels/${levelId}?language=en`
            : null,
        fetcher
    );

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
                return { ...el, backendId: item.id, status: item.status, completionDate: item.completionDate };
            }
        });

        return formattedLessons?.filter((e: any) => e).pop();
    });

    return {
        completedToday,
        data:
            levelId && mergedLessons
                ? mergedLessons?.filter((e: any) => e)
                : lessons,
        rewardAvailable: data?.data?.rewardAvailable || true,
        totalPoints: data?.data?.totalPoints || 0
    };
}
