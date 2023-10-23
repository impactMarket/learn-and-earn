import RichText from '../libs/Prismic/components/RichText';

function tokenAddressToName(tokenAddress: string) {
    // addresses for alfajores and mainnet
    switch (tokenAddress?.toLowerCase()) {
        case '0x73a2de6a8370108d43c3c80430c84c30df323ed2':
        case '0x46c9757c5497c5b1f2eb73ae79b6b67d119b0b58':
            return '$PACT';
        case '0x874069fa1eb16d44d622f2e0ca25eea172369bc1':
        case '0x765de816845861e75a25fca122bb6898b8b1282a':
            return 'cUSD';
        default:
            return '$PACT';
    }
}

export const ctaText = (
    status: string,
    reward: number,
    rewardAsset: string,
    earnRewardsCopy: any
) => {
    switch (status) {
        case 'available':
            return (
                <RichText
                    content={earnRewardsCopy}
                    medium
                    variables={{
                        asset: tokenAddressToName(rewardAsset),
                        reward
                    }}
                />
            );

        case 'started':
            // return <String id="continue" />;
            return 'Continue';
        case 'completed':
            // return <Message id="viewLessons" />;
            return 'View Lessons';
        default:
            return '';
    }
};

export const extractLessonIds = (level: any) =>
    level?.data?.lessons?.map((current: any) => current.lesson.id);
