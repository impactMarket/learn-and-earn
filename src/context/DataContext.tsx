import { createContext, useState, useEffect } from 'react';
import {
    useSinglePrismicDocument,
    useAllPrismicDocumentsByType
} from '@prismicio/react';
import { ViewContainer } from '@impact-market/ui';
import {
	useAccount,
	useConnect,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { chains } from '../helpers/network';

interface DataContextType {
    view: any;
    categories: any;
    token: string;
}

export const DataContext = createContext<DataContextType | undefined>(
    undefined
);

export const DataProviderCildren = ({ token, children }: { token: string, children: any }) => {
    const [view] = useSinglePrismicDocument('pwa-view-learn-and-earn');
    const [rawCategories] = useAllPrismicDocumentsByType('pwa-lae-category');

    const categories = rawCategories?.reduce((next, current) => {
        const { id, lang, data, alternate_languages } = current;
        const { title } = data;

        return { ...next, [id]: { alternate_languages, lang, title } };
    }, {});
  
    return (
        <DataContext.Provider value={{ categories, view, token }}>
            <ViewContainer
                {...({} as any)}
                style={{ minHeight: 'calc(100vh - 5.3rem)', padding: '0' }}
            >
                {children}
            </ViewContainer>
        </DataContext.Provider>
    );
};

export const DataProvider = ({ children }: any) => {
    const [token, setToken] = useState('');
	const { address, isConnected } = useAccount();
	const { connect } = useConnect({
		connector: new InjectedConnector({ chains }),
	});


    useEffect(() => {
        if (!isConnected) {
            connect();
        }
    }, [connect, isConnected]);
	useEffect(() => {
		if (address) {
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ address }),
                'client-id': 2,
			};
			fetch(
				"https://impactmarket-api-production.herokuapp.com/api/v2/users",
				requestOptions
			)
				.then((response) => response.json())
				.then((data) => setToken(data.data.token));
		}
	}, [address]);

    if (!isConnected) {
        return null;
    }
  
    return (
        <DataProviderCildren token={token} >{children}</DataProviderCildren>
    );
};
