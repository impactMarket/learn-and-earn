import {
    Box,
    Card,
    CircledIcon,
    Icon,
    Input,
    Text,
    TextLink,
    colors,
    toast
} from '@impact-market/ui';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { DataContext } from '../../context/DataContext';
import RichText from '../../libs/Prismic/components/RichText';
import { RewardsButton } from './Styles';
import processTransactionError from '../../utils/processTransactionError';
import { useNavigate } from 'react-router-dom';

const ConsentWrapper = styled(Box)`
    display: flex;
    flex-direction: row;
    margin-top: 1rem;
    gap: 0.5rem;
    align-items: center;
`;

const CheckBox = styled(Box)`
    background-color: ${colors.p100};
    border-radius: 5px;
    height: 20px;
    width: 20px;
`;

const IconStyled = styled(Icon)`
    color: ${colors.p500};
    height: 100%;
    width: 30px;
    margin: 0 auto;
`;

const ValidateEmail = () => {
    const navigate = useNavigate();

    const { email: user }: any = useContext(DataContext);
    const [openForm, setOpenForm] = useState(false);
    const { token }: any = useContext(DataContext);
    const [isLoading, setIsLoading] = useState(false);
    const [consent, setConsent] = useState(false);
    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user?.email) {
            setEmail(user.email);
        }
    }, [user]);

    const verifyEmail = async () => {
        if (!validateEmail(email)) {
            setIsEmailValid(false);
            return;
        }

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/users/request-verify`,
                {
                    body: JSON.stringify({
                        email: email,
                        url: import.meta.env.VITE_VERIFY_EMAIL_URL
                    }),
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    method: 'POST'
                }
            );

            const response = await res.json();

            if (response?.success) {
                setIsLoading(false);
                setOpenForm(false);
                setSuccess(true);
            } else {
                toast.error(`An error has occurred. Please try again later.`);
            }
        } catch (error) {
            processTransactionError(error, 'verify_email');
            console.log(error);
        }
    };

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value.toLowerCase());
        setIsEmailValid(true); // Reset email validation state when user types
    };

    return (
        <Card
            className="claim-rewards"
            style={{ boxSizing: 'border-box', flex: '1' }}
        >
            <Box
                style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {success ? (
                    <CircledIcon
                        icon="check"
                        success
                        style={{ margin: '0 auto' }}
                    />
                ) : (
                    <IconStyled icon="mail" />
                )}
                <RichText
                    style={{
                        color: `${colors.g700}`,
                        textAlign: 'center',
                        marginTop: '0.5rem'
                    }}
                    content={
                        !success
                            ? 'Confirm email to claim rewards'
                            : 'Check your inbox! '
                    }
                    semibold
                    large
                />

                {openForm ? (
                    <>
                        <Box style={{ marginTop: '1rem', width: '100%' }}>
                            <Input
                                id="email"
                                placeholder="Add email"
                                onChange={handleEmailChange}
                                value={email}
                                style={{
                                    color: '#101828',
                                    paddingLeft: '0.5rem'
                                }}
                                icon="mail"
                            />
                            {!isEmailValid && (
                                <Text
                                    extrasmall
                                    style={{
                                        color: colors.e600,
                                        paddingTop: '0.5rem'
                                    }}
                                >
                                    Please enter a valid address
                                </Text>
                            )}
                        </Box>
                        <ConsentWrapper>
                            <Box mr={0.6}>
                                <CheckBox
                                    onClick={() => setConsent(!consent)}
                                    padding={0.3}
                                    flex
                                >
                                    {consent && (
                                        <Icon
                                            icon="tick"
                                            h="100%"
                                            w="100%"
                                            style={{ color: colors.p500 }}
                                        />
                                    )}
                                </CheckBox>
                            </Box>
                            <label style={{ textAlign: 'left' }}>
                                <Text small style={{ color: colors.g700 }}>
                                    I agree to the Privacy Policy and to receive
                                    updates from impactMarket.
                                </Text>
                            </label>
                        </ConsentWrapper>
                        <RewardsButton
                            isLoading={isLoading}
                            style={{ backgroundColor: colors.s400 }}
                            onClick={verifyEmail}
                            disabled={!consent || !email}
                        >
                            Confirm email
                        </RewardsButton>
                    </>
                ) : (
                    <>
                        {!success && (
                            <RewardsButton
                                onClick={() => setOpenForm(true)}
                                isLoading={isLoading}
                                style={{ backgroundColor: colors.s400 }}
                            >
                                Continue
                            </RewardsButton>
                        )}

                        {success && (
                            <>
                                <Text
                                    style={{
                                        color: colors.g700,
                                        textAlign: 'center'
                                    }}
                                >
                                    We've sent you an email to {email}.
                                </Text>
                                <TextLink
                                    onClick={() => {
                                        setSuccess(false);
                                        setOpenForm(true);
                                    }}
                                    style={{
                                        marginTop: '1rem',
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Text style={{ color: colors.b500 }}>
                                        Change email
                                    </Text>
                                </TextLink>
                            </>
                        )}
                    </>
                )}
                <TextLink
                    onClick={() => {
                        navigate(0);
                    }}
                    style={{
                        marginTop: '1rem',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <Text extrasmall style={{ color: colors.b500 }}>
                        Refresh page
                    </Text>
                </TextLink>
            </Box>
        </Card>
    );
};

export default ValidateEmail;
