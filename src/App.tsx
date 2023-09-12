import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './components/Home/Home';
import Header from './components/Header/Header';
import Level from './components/Level/Level';


// import { useSinglePrismicDocument, useAllPrismicDocumentsByType } from '@prismicio/react';
import { DataProvider } from './context/DataContext';
import Lesson from './components/Lesson/Lesson';
import {
    WagmiConfig,
    useAccount,
    useConnect,
    // useNetwork,
    // useWalletClient
} from "wagmi";
// import { ImpactProvider } from "@impact-market/utils/ImpactProvider";
import { chains, wagmiConfig } from './helpers/network';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useEffect, useState } from 'react';

function Wrapper() {
    const [token, setToken] = useState('');
    const { address, isConnected } = useAccount();
    // const { data: signer } = useWalletClient();
    // const { chain } = useNetwork();
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
                    <Route path="/:levelId/:uid" element={<Lesson />} />
                    <Route path="/:levelId" element={<Level />} />
                </Routes>
            </DataProvider>
        </BrowserRouter>
        // </ImpactProvider>
    );
}

function App() {
    if (
        (window as any).ethereum.isMiniPay ||
        ((window as any).ethereum.isMetaMask &&
            import.meta.env.VITE_ENABLE_IN_BROWSER === 'true')
    ) {
        return (
            <WagmiConfig config={wagmiConfig}>
                <Wrapper />
            </WagmiConfig>
        );
    }

    return null;
}

export default App;
