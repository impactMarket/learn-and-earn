import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import {
    // Alert,
    // Box,
    // Display,
    // DropdownMenu,
    // Pagination,
    // Tab,
    // TabList,
    // Tabs,
    ViewContainer
} from '@impact-market/ui';

import Home from './components/Home/Home';
import Header from './components/Header/Header';
import Level from './components/Level/Level';

import { useParams } from 'react-router-dom';

// import { useSinglePrismicDocument, useAllPrismicDocumentsByType } from '@prismicio/react';
import { DataProvider } from './context/DataContext';
import Lesson from './components/Lesson/Lesson';
import {
	WagmiConfig,
	useAccount,
	useConnect,
	useNetwork,
	useWalletClient
} from "wagmi";
import { ImpactProvider } from "@impact-market/utils/ImpactProvider";
import { chains, wagmiConfig } from './helpers/network';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useEffect, useState } from 'react';


const Test = () => {
    const { slug, uid } = useParams();

    return <div>{`Page of Lesson: ${slug} ${uid}`}</div>;
};

function Wrapper() {
    const [token, setToken] = useState('');
	const { address, isConnected } = useAccount();
	const { data: signer } = useWalletClient();
	const { chain } = useNetwork();
	const { connect } = useConnect({
		connector: new InjectedConnector({ chains }),
	});

    useEffect(() => {
        console.log({ isConnected })
        connect();
    }, []);
    useEffect(() => {
        console.log({ address })
		if (address) {
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ address }),
                'client-id': 2,
			};
			fetch(
				import.meta.env.VITE_API_URL + "/users",
				requestOptions
			)
				.then((response) => response.json())
				.then((data) => setToken(data.data.token));
		}
	}, [address]);

	return (
		// <ImpactProvider
		// 	jsonRpc={import.meta.env.VITE_JSON_RPC}
		// 	signer={signer ?? null}
		// 	address={address ?? null}
		// 	networkId={chain?.id || 42220}
		// >
			<BrowserRouter>
                <Header />
                <DataProvider token={token}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            {/* <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/guides" element={<Guides />} /> */}
                            <Route path="/:levelId/:uid" element={<Lesson />} />
                            <Route path="/:levelId" element={<Level />} />
                        </Routes>
                </DataProvider>
            </BrowserRouter>
		// </ImpactProvider>
	);
}

function App() {
	return (
        <WagmiConfig config={wagmiConfig}>
            <Wrapper />
        </WagmiConfig>
	);
}

export default App;
