import { createContext, useState, useEffect } from 'react';
import {
    useSinglePrismicDocument,
    useAllPrismicDocumentsByType
} from '@prismicio/react';
import { Spinner } from '@impact-market/ui';
import { ViewContainer } from '../Theme';

interface DataContextType {
    view: any;
    categories: any;
    token: string;
    setIsLoading: (state: boolean) => void
}

export const DataContext = createContext<DataContextType | undefined>(
    undefined
);

export const DataProvider = ({
    token,
    children
}: {
    token: string;
    children: any;
}) => {
    const [view] = useSinglePrismicDocument('pwa-view-learn-and-earn');
    const [rawCategories] = useAllPrismicDocumentsByType('pwa-lae-category');
    const [isLoading, setIsLoading] = useState(true);
    const categories = rawCategories?.reduce((next, current) => {
        const { id, lang, data, alternate_languages } = current;
        const { title } = data;

        return { ...next, [id]: { alternate_languages, lang, title } };
    }, {});

    useEffect(() => {
        if (isLoading) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = 'auto';
        }
      }, [isLoading]);

    const contextValue = { categories, view, token, setIsLoading };

    const LoadingComponent = () => {
        return isLoading ? (
            <div
                style={{
                    position: 'fixed',
                    width: '100vw',
                    height: '100vh',
                    background: '#F9FAFB',
                    zIndex: 1,
                    left: 0,
                    top: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Spinner g400 isActive />
            </div>
        ) : null;
    };

    return (
        <DataContext.Provider value={contextValue}>
            <ViewContainer
                {...({} as any)}
                style={{
                    minHeight: 'calc(100vh - 5.3rem)',
                    padding: '0',
                    overflow: isLoading ? 'hidden' : ''
                }}
            >
                <LoadingComponent />
                {children}
            </ViewContainer>
        </DataContext.Provider>
    );
};
