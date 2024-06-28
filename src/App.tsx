import React from 'react';
import {
    BrowserRouter,
    Route,
    Routes,
    createRoutesFromChildren,
    matchRoutes,
    useLocation,
    useNavigate,
    useNavigationType
} from 'react-router-dom';

import {
    Box,
    Card,
    ModalManager,
    ModalWrapper,
    TextLink,
    Text,
    Toaster,
    colors,
    openModal,
    toast,
    useModal,
    CircledIcon
} from '@impact-market/ui';

import Home from './components/Home/Home';
import Level from './components/Level/Level';
import Pact from './components/Pact';

import {
    WagmiConfig,
    useAccount,
    useConnect
    // useNetwork,
    // useWalletClient
} from 'wagmi';
import Lesson from './components/Lesson/Lesson';
import { DataProvider } from './context/DataContext';
// import { ImpactProvider } from "@impact-market/utils/ImpactProvider";
import { useEffect, useState } from 'react';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { chains, wagmiConfig } from './helpers/network';

// Import the functions you need from the SDKs you need
import * as Sentry from '@sentry/react';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import './helpers/polyfills';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const {
    VITE_ANALYTICS_APIKEY,
    VITE_ANALYTICS_SENDERID,
    VITE_ANALYTICS_APPID,
    VITE_ANALYTICS_MEASUREMENTID,
    VITE_SENTRY_DSN,
    VITE_API_URL
} = import.meta.env;

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: VITE_ANALYTICS_APIKEY,
    authDomain: 'learn-and-earn-opera.firebaseapp.com',
    projectId: 'learn-and-earn-opera',
    storageBucket: 'learn-and-earn-opera.appspot.com',
    messagingSenderId: VITE_ANALYTICS_SENDERID,
    appId: VITE_ANALYTICS_APPID,
    measurementId: VITE_ANALYTICS_MEASUREMENTID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Sentry
Sentry.init({
    dsn: VITE_SENTRY_DSN,
    // Ignore errors from DOM custom properties
    beforeBreadcrumb(breadcrumb) {
        if (
            breadcrumb.category === 'console' &&
            breadcrumb.level === 'warning'
        ) {
            if (
                breadcrumb.message &&
                breadcrumb.message.startsWith('styled-components: ')
            ) {
                return null;
            }
        }
        if (breadcrumb.category === 'console' && breadcrumb.level === 'error') {
            if (
                breadcrumb.message &&
                breadcrumb.message.startsWith('Warning: ')
            ) {
                return null;
            }
        }

        return breadcrumb;
    },
    integrations: [
        new Sentry.BrowserTracing({
            routingInstrumentation: Sentry.reactRouterV6Instrumentation(
                React.useEffect,
                useLocation,
                useNavigationType,
                createRoutesFromChildren,
                matchRoutes
            )
        }),
        new Sentry.Replay()
    ],
    tracesSampler: (samplingContext) => {
        const error = samplingContext.transactionContext;

        if (error) {
            if (error.tags && error.tags['user_activity']) {
                // if there's any user action, send 100%
                // (it tracks only extremely important errors)
                return 1;
            } else if (
                error.description &&
                (error.description.match(/GeolocationPositionError/i) ||
                    error.description.match(/denied transaction signature/i))
            ) {
                // some things we know and want to ignore
                return 0;
            }
        }

        return 0.1;
    },
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0
});

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

export const ErrorModal = () => {
    const navigate = useNavigate();

    return (
        <ModalWrapper maxW={20}>
            <Box
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '2rem'
                }}
            >
                <CircledIcon
                    icon="alertTriangle"
                    error
                    style={{ margin: '0 auto' }}
                    large
                />

                <Box style={{ marginTop: '1rem', width: '100%' }}>
                    <Text
                        style={{
                            paddingTop: '0.5rem',
                            textAlign: 'center'
                        }}
                    >
                        We would like to apologize but we’re currently
                        experiencing issues with Learn & Earn. Our team is
                        working to fix them as soon as possible.
                    </Text>
                    <Text
                        style={{
                            paddingTop: '0.5rem',
                            textAlign: 'center'
                        }}
                    >
                        Thank you for your consideration.
                    </Text>
                </Box>

                <TextLink
                    onClick={() => {
                        navigate(0);
                    }}
                    style={{
                        marginTop: '1rem',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <Text
                        extrasmall
                        style={{ textDecoration: 'underline', color: '#000' }}
                    >
                        Refresh page
                    </Text>
                </TextLink>
            </Box>
        </ModalWrapper>
    );
};

const modals = {
    errorModal: ErrorModal
};

function Wrapper() {
    const [token, setToken] = useState('');
    const [email, setEmail] = useState({
        email: '',
        validated: ''
    });
    const { address, isConnected } = useAccount();
    // const { data: signer } = useWalletClient();
    // const { chain } = useNetwork();
    const { connect } = useConnect({
        connector: new InjectedConnector({ chains })
    });

    useEffect(() => {
        console.log({ isConnected });
        logEvent(analytics, 'page_loaded');
        connect();
    }, []);

    useEffect(() => {
        console.log({ address });
        if (address) {
            const fetchUserData = async () => {
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'client-id': 2
                    } as any,
                    body: JSON.stringify({ address })
                };

                try {
                    const response = await fetch(
                        VITE_API_URL + '/users',
                        requestOptions
                    );
                    if (!response.ok) {
                        // If the response status is not in the range 200-299, throw an error
                        throw new Error(
                            `HTTP error! status: ${response.status}`
                        );
                    }
                    const data = await response.json();
                    setToken(data.data.token);
                    setEmail({
                        email: data.data.email,
                        validated: data.data.emailValidated
                    });
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    openModal('errorModal');
                }
            };

            fetchUserData();
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
            <DataProvider token={token} email={email}>
                <Toaster />
                <ModalManager modals={modals} />
                <SentryRoutes>
                    <Route path="/" element={<Home />} />
                    <Route path="/pact" element={<Pact />} />
                    <Route path="/:levelId/:uid" element={<Lesson />} />
                    <Route path="/:levelId" element={<Level />} />
                </SentryRoutes>
            </DataProvider>
        </BrowserRouter>
        // </ImpactProvider>
    );
}

function App() {
    // if (
    //     (window as any).ethereum.isMiniPay ||
    //     ((window as any).ethereum.isMetaMask &&
    //         import.meta.env.VITE_ENABLE_IN_BROWSER === 'true')
    // ) {
    // }
    return (
        <WagmiConfig config={wagmiConfig}>
            <Wrapper />
        </WagmiConfig>
    );

    // return null;
}

export default App;
