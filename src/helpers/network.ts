import {
	createConfig,
} from "wagmi";
import { celo } from "viem/chains";
import { publicProvider } from '@wagmi/core/providers/public'
import { configureChains } from '@wagmi/core'

export const { chains, publicClient } = configureChains(
	[celo],
	[publicProvider()],
)

export const wagmiConfig = createConfig({
	autoConnect: true,
	chains,
	publicClient
});