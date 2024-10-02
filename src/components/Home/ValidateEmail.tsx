import {
    Box,
    Card,
    CircledIcon,
    Icon,
    Input,
    Select,
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
import { countriesOptions } from '../../utils/countries';

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

const SelectStyled = styled(Select)<{ openSelect: boolean }>`
    & > div {
        opacity: ${(props) => (props.openSelect ? 1 : 0)};
        visibility: ${(props) => (props.openSelect ? 'visible' : 'hidden')};
        border-radius: 0.5rem;
        box-shadow: 0 0.125rem 0.0625rem rgba(16, 24, 40, 0.05),
            0 0 0 1px #d0d5dd;
        top: unset;
        transform: translateY(10px);
    }
`;

const ValidateEmail = () => {
    const navigate = useNavigate();

    const { user }: any = useContext(DataContext);
    const [openForm, setOpenForm] = useState(false);
    const { token }: any = useContext(DataContext);
    const [isLoading, setIsLoading] = useState(false);
    const [consent, setConsent] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [success, setSuccess] = useState(false);
    const [gender, setGender] = useState();
    const [country, setCountry] = useState();
    const [openCountryDropdown, setOpenCountryDropdown] = useState(false);
    const [openGenderDropdown, setOpenGenderDropdown] = useState(false);

    const [userUpdated, setUserUpdated] = useState({
        email: '',
        firstName: '',
        lastName: '',
        age: null,
        gender: '',
        country: ''
    });

    useEffect(() => {
        if (user) {
            setUserUpdated({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                age: user.age,
                gender: user.gender,
                country: user.country
            });
        }
    }, [user]);

    console.log('User updated: ', userUpdated);

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserUpdated((prevState) => ({
            ...prevState,
            email: e.target.value.toLowerCase()
        }));

        setIsEmailValid(true); // Reset email validation state when user types
    };

    const handleInputChange = (
        field: string,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setUserUpdated((prevState) => ({
            ...prevState,
            [field]: e.target.value
        }));
    };

    const handleSelectChange = (field: string, e: string) => {
        setUserUpdated((prevState) => ({
            ...prevState,
            [field]: e
        }));

        const setters: any = {
            gender: setGender,
            country: setCountry
        };

        if (setters[field]) {
            setters[field](e);
        }
    };

    const verifyEmail = async () => {
        if (!validateEmail(userUpdated.email)) {
            setIsEmailValid(false);
            return;
        }

        console.log('push', userUpdated);

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/users/request-verify`,
                {
                    body: JSON.stringify({
                        email: userUpdated.email,
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

    const showSelectedCountry = () => {
        if (country) {
            return <Text>{country}</Text>;
        }

        return <Text g500>Select your country</Text>;
    };

    const showSelectedGender = () => {
        if (gender) {
            return <Text>{gender}</Text>;
        }

        return <Text g500>Select your gender</Text>;
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
                            ? 'Complete your information'
                            : 'Check your inbox! '
                    }
                    semibold
                    large
                />

                {openForm ? (
                    <>
                        <Box style={{ marginTop: '1rem', width: '100%' }}>
                            <Text
                                g700
                                medium
                                small
                                style={{ marginBottom: '0.375rem' }}
                            >
                                Email*
                            </Text>
                            <Input
                                id="email"
                                placeholder="Add email"
                                onChange={handleEmailChange}
                                value={userUpdated.email}
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
                        <Box style={{ marginTop: '1.5rem', width: '100%' }}>
                            <Text
                                g700
                                medium
                                small
                                style={{ marginBottom: '0.375rem' }}
                            >
                                First Name*
                            </Text>
                            <Input
                                id="first-name"
                                placeholder="First name"
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => handleInputChange('firstName', e)}
                                value={userUpdated.firstName}
                                style={{
                                    color: '#101828',
                                    paddingLeft: '0.5rem'
                                }}
                                icon="user"
                            />
                        </Box>
                        <Box style={{ marginTop: '1.5rem', width: '100%' }}>
                            <Text
                                g700
                                medium
                                small
                                style={{ marginBottom: '0.375rem' }}
                            >
                                Last Name
                            </Text>
                            <Input
                                id="last-name"
                                placeholder="Last name"
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => handleInputChange('lastName', e)}
                                value={userUpdated.lastName}
                                style={{
                                    color: '#101828',
                                    paddingLeft: '0.5rem'
                                }}
                                icon="user"
                            />
                        </Box>
                        <Box style={{ marginTop: '1.5rem', width: '100%' }}>
                            <Text
                                g700
                                medium
                                small
                                style={{ marginBottom: '0.375rem' }}
                            >
                                Age*
                            </Text>
                            <Input
                                id="age"
                                placeholder="Age"
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => handleInputChange('age', e)}
                                value={userUpdated.age}
                                style={{
                                    color: '#101828',
                                    paddingLeft: '0.5rem'
                                }}
                                icon="user"
                                type="number"
                                label="Age"
                            />
                        </Box>
                        <Box style={{ marginTop: '1.5rem', width: '100%' }}>
                            <Text
                                g700
                                medium
                                small
                                style={{ marginBottom: '0.375rem' }}
                            >
                                Country*
                            </Text>
                            <SelectStyled
                                onChange={(country: string) =>
                                    handleSelectChange('country', country)
                                }
                                options={countriesOptions}
                                renderLabel={showSelectedCountry}
                                onClick={() =>
                                    setOpenCountryDropdown(!openCountryDropdown)
                                }
                                openSelect={openCountryDropdown}
                            />
                        </Box>
                        <Box style={{ marginTop: '1.5rem', width: '100%' }}>
                            <Text
                                g700
                                medium
                                small
                                style={{ marginBottom: '0.375rem' }}
                            >
                                Gender*
                            </Text>
                            <SelectStyled
                                onChange={(gender: string) =>
                                    handleSelectChange('gender', gender)
                                }
                                options={[
                                    { label: 'Male', value: 'm' },
                                    { label: 'Female', value: 'f' },
                                    { label: 'Other', value: 'o' }
                                ]}
                                renderLabel={showSelectedGender}
                                onClick={() =>
                                    setOpenGenderDropdown(!openGenderDropdown)
                                }
                                openSelect={openGenderDropdown}
                            />
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
