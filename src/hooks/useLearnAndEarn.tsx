import { useContractWrite } from 'wagmi';

const learnAndEarnABI = [
    {
        inputs: [
            {
                internalType: 'address',
                name: '_beneficiary',
                type: 'address'
            },
            {
                internalType: 'uint256[]',
                name: '_levelIds',
                type: 'uint256[]'
            },
            {
                internalType: 'uint256[]',
                name: '_rewardAmounts',
                type: 'uint256[]'
            },
            {
                internalType: 'bytes[]',
                name: '_signatures',
                type: 'bytes[]'
            }
        ],
        name: 'claimRewardForLevels',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    }
];

export default function useLearnAndEarn() {
    const { isLoading, isSuccess, writeAsync } = useContractWrite({
        address:
            import.meta.env.VITE_TESTNET === 'true'
                ? '0x959eFf854990948B5F5d46986cd8C5B906741114'
                : '0x496F7De1420ad52659e257C7Aa3f79a995274dbc',
        abi: learnAndEarnABI,
        functionName: 'claimRewardForLevels'
    });

    const claimRewardForLevels = (
        beneficiary: string,
        levelIds: number[],
        rewardAmounts: string[],
        signatures: string[]
    ) => writeAsync!({ args: [beneficiary, levelIds, rewardAmounts, signatures] });

    return { isLoading, isSuccess, claimRewardForLevels };
}
