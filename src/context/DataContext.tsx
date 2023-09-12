import { createContext, useState, useEffect } from 'react';
import {
    useSinglePrismicDocument,
    useAllPrismicDocumentsByType
} from '@prismicio/react';
import { ViewContainer, Spinner } from '@impact-market/ui';

interface DataContextType {
    view: any;
    categories: any;
    token: string;
    // setIsLoading: (state: boolean) => void
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
        // Set the body's overflow style based on isLoading
        if (isLoading) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = 'auto'; // Restore the default overflow value
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

    // addTest(false)
    // setIsLoading(false)
    // isLoading = false;

    return (
        <DataContext.Provider value={contextValue}>
            <ViewContainer
                {...({} as any)}
                // isLoading={isLoading}
                style={{
                    minHeight: 'calc(100vh - 5.3rem)',
                    padding: '0',
                    overflow: isLoading ? 'hidden' : ''
                }}
            >
                <LoadingComponent />
                {children}
                {/* {isLoading ? 'Loading' : children} */}
            </ViewContainer>
        </DataContext.Provider>
    );
};
