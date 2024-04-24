import { Box, Label } from '@impact-market/ui';
import { DataContext } from '../context/DataContext';
import { Heading } from './Home/Styles';
import { useContext, useEffect } from 'react';
import { BackButton } from '../Theme';
import { useNavigate } from 'react-router-dom';
import RichText from '../libs/Prismic/components/RichText';
import styled from 'styled-components';

const Description = styled(RichText)`
    a {
        color: #5a6fef;
        font-weight: 600;
        text-decoration: none;
    }
`;

const Pact = () => {
    const { setIsLoading, view }: any = useContext(DataContext);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(false);
    }, []);

    return (
        <>
            <BackButton as="a" onClick={() => navigate(`/`)}>
                <Label
                    content="Back"
                    icon="arrowLeft"
                    style={{ backgroundColor: 'transparent', padding: 0 }}
                />
            </BackButton>
            <Box>
                <Heading style={{ textAlign: 'left' }}>
                    {view?.data['how-to-pact']}
                </Heading>
                <Box>
                    <Heading
                        style={{
                            fontSize: '16px',
                            textAlign: 'left',
                            marginBottom: 0
                        }}
                    >
                        {view?.data['stake-pact']}
                    </Heading>
                    <Description
                        content={view?.data['stake-pact-description']}
                        small
                        regular
                        style={{ color: '#344054' }}
                    />
                    <Description
                        content={view?.data['ready-to-stake']}
                        small
                        regular
                        style={{ color: '#344054', marginTop: '0.5rem' }}
                    />
                </Box>
            </Box>
        </>
    );
};

export default Pact;
