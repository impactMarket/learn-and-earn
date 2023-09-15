import styled from 'styled-components';
import {
    Box,
    ComposedCard,
    Display,
    DropdownMenu,
    TabList
} from '@impact-market/ui';
import { breakpoints } from '../Breakpoints';
import { Button } from '../../Theme';
import { colors } from '@impact-market/ui';

export const ClickableCard = styled(ComposedCard)`
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    flex: 0 0 calc(32%);
    justify-content: space-between;
    margin-bottom: 1rem;
    min-width: 100px;

    > div {
        box-sizing: border-box;
    }

    > div:first-of-type {
        > div {
            background-color: ${colors.p50};
            color: ${colors.p700};
            font-family: Inter, sans-serif;
            position: absolute;
        }
    }

    > div:nth-child(2) {
        margin-top: 0.75rem;
    }

    > div:nth-child(3) {
        margin-top: 0.5rem;
        color: ${colors.g500};
        flex: 1;
    }

    @media (max-width: ${breakpoints.large}) {
        flex-basis: 100%;
    }
`;

export const Grid = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    gap: 2%;
    justify-content: flex-start;

    @media (max-width: ${breakpoints.medium}) {
        flex-direction: column;
    }
`;

export const Dropdown = styled(DropdownMenu)`
    > div {
        display: flex;
        width: 100%;
        box-sizing: border-box;
        justify-content: space-between;

        > div {
            width: 100%;
            box-sizing: border-box;

            > div {
                box-sizing: border-box;
            }
        }

        p {
            margin: 0;
        }
    }

    @media (max-width: ${breakpoints.small}) {
        width: 99% !important;
    }
`;

export const CategoryTabs = styled(TabList)`
    ul {
        display: flex;

        li {
            margin: 0 0.4rem !important;
        }
    }
    div {
        > p {
            margin: 0;
        }
    }
`;

export const RewardsButton = styled(Button)`
    border: transparent;
    margin-top: 1rem;
    width: 100%;
`;

export const MetricsWrapper = styled(Box)`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: space-between;

    @media (max-width: ${breakpoints.large}) {
        .stats {
            flex-basis: 46%;
        }

        .claim-rewards {
            flex-basis: 100% !important;
        }
    }

    @media (max-width: ${breakpoints.small}) {
        .stats {
            padding: 0.5rem;

            svg {
                padding-left: .5rem;
            }

            > div > div {
                &:first-of-type {
                    display: flex;
                    height: 3rem;
                    justify-content: center;
                    width: auto;
    
                    > svg {
                        height: 100%;
                    }
                }
    
                &:last-of-type {
                    padding-left: 1rem;
                }

                > div:first-of-type {
                    color: ${colors.g500}
                }

            }

            h1 {
                font-size: 1.2rem;
                font-weight: 600;
            }
        }
    }
`;

export const Heading = styled(Display)`
    color: ${colors.g700};
    font-size: 1.875rem;
    font-weight: 600;
    line-height: 2.375rem;
    margin-bottom: 1rem;
    text-align: center;

    @media (max-width: ${breakpoints.small}) {
        font-size: 1.1rem;
        line-height: 28px;
    }
`;

export const DropdownWrapper = styled(Box)`
    @media (max-width: ${breakpoints.small}) {
        width: 100%;
        margin-bottom: 1rem;
    }
`;
