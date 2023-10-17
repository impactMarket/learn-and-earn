import {
    Button as ButtonUI,
    Display as DisplayUI,
    Box,
    Text as TextUI,
    Badge as BadgeUI,
    ViewContainer as ViewConatinerUI
} from '@impact-market/ui';
import { colors } from '@impact-market/ui';
import styled from 'styled-components';

export const Button = styled(ButtonUI)`
    background-color: #5a6fef;
    transition: opacity 0.2s ease-in-out;
    width: ${(props) => (props.fluid ? '100%' : 'auto')};

    &:not(:disabled):hover {
        background-color: #5a6fef;
        opacity: 0.5;
        border: none;
    }

    > span {
        padding: 0.8rem !important;

        p {
            color: white;
            margin: 0;
        }
    }
`;

export const Display = styled(DisplayUI)`
    font-weight: 600;
    font-size: ${(props) => (props.medium ? '1.9rem' : '1.3rem')};
    color: ${(props) => (props.main ? '#5A6FEF' : `${colors.g900}`)};
`;

export const BackButton = styled(Box)`
    cursor: pointer;
    
    > div {
        border-radius: .5rem;
        padding: .5rem .75rem;
        margin-bottom: 1.5rem;

        > p {
            margin-left: .5rem;
        }
    }
`;

export const Text = styled(TextUI)`
   font-size: .875rem;
   line-height: 1.25rem;
   font-weight: ${(props) => (props.bold ? '600' : '400')};
   color: ${(props) => (props.g500 ? `${colors.g500}` : `${colors.g800}`)};
   margin-bottom: ${(props) => (props.noMargin ? '0' : '1rem')};
`;

export const Badge = styled(BadgeUI)`
    background-color: ${colors.s50};
    color: ${colors.s700};
    font-family: Inter, sans-serif;
`;

export const ViewContainer = styled(ViewConatinerUI)`
    background-color: ${colors.g100};
`;
