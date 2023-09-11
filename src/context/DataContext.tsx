import { createContext } from 'react';
import {
    useSinglePrismicDocument,
    useAllPrismicDocumentsByType
} from '@prismicio/react';
import { ViewContainer } from '@impact-market/ui';

interface DataContextType {
    view: any;
    categories: any;
    token: string;
}

export const DataContext = createContext<DataContextType | undefined>(
    undefined
);

export const DataProvider = ({ token, children }: { token: string, children: any }) => {
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
