import { Box } from '@impact-market/ui';
import { HeaderWrapper } from './Styles';

const Header = () => {
    return (
        <HeaderWrapper>
            <Box>
                <img
                    alt="impactMarket logo"
                    src="/impactMarket-logo.svg"
                    width="100px"
                />
            </Box>
            <Box>
                <img
                    alt="Learn&Earn logo"
                    src="/L&E.svg"
                    width="141px"
                />
            </Box>
        </HeaderWrapper>
    );
};

export default Header;
