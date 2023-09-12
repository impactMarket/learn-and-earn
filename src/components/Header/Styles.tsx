import styled from 'styled-components';
import { colors } from '@impact-market/ui';

export const HeaderWrapper = styled.div`
    align-items: center;
    background-color: ${colors.n01};
    display: flex;
    height: 2.3rem;
    justify-content: center;
    padding: 1rem;
    position: relative;
    z-index: 2;

    > div {
        align-items: center;
        display: flex;
        height: 100%;
    }

    > div:first-child {
        border-right: 1px solid #A7C0FE;

        > img {
            margin-right: 1rem;
        }
    }

    > div:nth-child(2) {
        > img {
            margin-left: 1rem;
        }
    }
`;
