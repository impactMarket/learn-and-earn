import {
    // Alert,
    Box,
    // Display,
    // DropdownMenu,
    Pagination,
    Tab,
    // TabList,
    Tabs
} from '@impact-market/ui';
// import { Display } from '../../Theme';
import { DataContext } from '../../context/DataContext';
import { Dropdown, CategoryTabs, Heading, DropdownWrapper } from './Styles';
import { useAllPrismicDocumentsByType } from '@prismicio/react';
import { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Filters from '../Filters';
import LevelsTable from './LevelsTable';
import Metrics from './Metrics';
import queryString from 'query-string';
import RichText from '../../libs/Prismic/components/RichText';
import useLevels from '../../hooks/useLevels';
import useSWR from 'swr';



const ITEMS_PER_PAGE = 6;

function Home() {
    const { view, categories, token }: any = useContext(DataContext);
    const [searchParams, setSearchParams] = useSearchParams();

    const {
        'earn-rewards': earnRewards,
        'heading-content': headingContent,
        'heading-title': headingTitle,
        'claim-available': claimAvailable = '',
        'claim-disabled': claimDisabled = ''
        // 'only-beneficiaries-tooltip': onlyBeneficiariesTooltip = ''
    } = view?.data ?? {
        'earn-rewards': 'Earn Rewards',
        'heading-content': '',
        'heading-title': ''
    };

    const [levels] = useAllPrismicDocumentsByType('pwa-lae-level');
    const { data } = useLevels(levels, token);
    const queryParams = queryString.parse(location.search);
    const {
        page = 0,
        search: searchString = '',
        state: stateString = 'available',
        category: categoryString = null
    } = queryParams;
    console.log(stateString);

    const [currentPage, setCurrentPage] = useState(+page);
    const [search, setSearch] = useState(searchString);
    const [state, setState] = useState(stateString);
    // const [dataLoaded, setDataLoaded] = useState(true);

    const pageStart = currentPage * ITEMS_PER_PAGE;
    const pageEnd = currentPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE;

    const clearQueryString = (param: string) => {
        const updatedSearchParams = new URLSearchParams(searchParams);

        updatedSearchParams.delete(param);

        setSearchParams(updatedSearchParams);
    };

    useEffect(() => {
        setCurrentPage(!searchString && !!page ? +page : 0);
        setSearch(searchString?.toString().toLowerCase() || '');
    }, [searchString]);

    const categoryItems = [
        { id: '', onClick: () => clearQueryString('category'), title: 'All Categories' },
        ...new Set(
            categories &&
                Object.values(categories).map((item: any, idx: number) => {
                    const value = Object.keys(categories)[idx];

                    return {
                        id: value,
                        onClick: () => setSearchParams({ category: value }),
                        title: item.title
                    };
                })
        )
    ];

    const selectedCategory =
        categoryItems.find((el: any) => el.id === categoryString ?? '')
            ?.title || 'All Categories';

    const totalPages = (items: number) => {
        const pages = Math.floor(items / ITEMS_PER_PAGE);

        return items % ITEMS_PER_PAGE > 0 ? pages + 1 : pages;
    };

    const Progress = () => {
        let metrics = {
            claimRewards: {
                amount: false,
                levelId: false,
                signature: false
            },
            lesson: {
                completed: 0,
                total: 0
            },
            level: {
                completed: 0,
                total: 0
            }
        };

        if (token) {
            const fetcher = (url: string) =>
                fetch(import.meta.env.VITE_API_URL + url, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then((res) => res.json());
            const { data: laeData } = useSWR(`/learn-and-earn`, fetcher);

            metrics = {
                ...metrics,
                ...laeData?.data
            };
        }

        return (
            <Metrics
                metrics={metrics}
                copy={{ failed: claimDisabled, success: claimAvailable }}
            />
        );
    };

    const filteredData = data
        ?.filter(
            (item: any) => item?.title?.toLowerCase().indexOf(search) !== -1
        )
        .filter((el: any) => el.status === state)
        .filter((el: any) =>
            !!categoryString ? el.category === categoryString : el
        );

    const TabItems: string[] = ['started', 'available', 'completed'];
    const filterLevels = (filter: string) => {
        return data?.filter((el: any) => el.status === filter);
    };

    //  Handle Pagination
    const handlePageClick = (event: any, direction?: number) => {
        let page;

        if (event.selected >= 0) {
            page = event.selected;
        } else if (direction === 1) {
            page = currentPage - 1;
        } else if (direction === 2) {
            page = currentPage + 1;
        }

        setCurrentPage(page);
        setSearchParams({ page });
    };

    return (
        <>
            <Box flex style={{ justifyContent: 'space-between' }}>
                <Box flex fDirection={'column'}>
                    <Heading>
                        {'Earn rewards directly in MiniPay by learning about selected web3 projects'}
                    </Heading>
                </Box>
            </Box>
            {<Progress />}
            <Tabs defaultIndex={0}>
                <CategoryTabs>
                    {TabItems.map((el: string, idx: number) => (
                        <Tab
                            key={idx}
                            onClick={() => {
                                setState(el);
                                setSearchParams({ page: 0, state: el } as any);
                                setCurrentPage(0);
                            }}
                            title={el}
                            number={!!data ? filterLevels(el).length : 0}
                        />
                    ))}
                </CategoryTabs>

                <Box
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        marginBottom: '1rem',
                        padding: '.5rem 0rem'
                    }}
                >
                    <DropdownWrapper>
                        <Dropdown
                            {...({} as any)}
                            asButton
                            headerProps={{
                                fLayout: 'center between'
                            }}
                            icon="chevronDown"
                            items={categoryItems}
                            title={selectedCategory}
                            style={{ marginRight: '1rem', width: '15rem' }}
                            wrapperProps={{
                                mr: 1,
                                w: 15
                            }}
                        />
                    </DropdownWrapper>

                    <Box style={{ flexGrow: '1' }}>
                        <Filters property="search" />
                    </Box>
                </Box>

                {/* <Alert icon="infoCircle" mb={1} title={onlyBeneficiariesTooltip} /> */}

                {filteredData && categories && (
                    <LevelsTable
                        data={filteredData ?? []}
                        lang={'en-us'}
                        pageEnd={pageEnd}
                        pageStart={pageStart}
                        earnRewardsCopy={earnRewards}
                    />
                )}

                <Pagination
                    currentPage={currentPage}
                    handlePageClick={handlePageClick}
                    mt={2}
                    nextIcon="arrowRight"
                    nextLabel={'Next'}
                    pageCount={totalPages(!!data ? filteredData.length : 0)}
                    pb={7}
                    previousIcon="arrowLeft"
                    previousLabel={'Previous'}
                />
            </Tabs>
        </>
    );
}

export default Home;