import {
    Box,
    // Button,
    CircledIcon,
    // ComposedCard,
    // Grid,
    Text
} from '@impact-market/ui';
import { ctaText } from '../../helpers/Helpers';
// import { selectCurrentUser } from '../../state/slices/auth';
// import { useRouter } from 'next/router';
// import { useSelector } from 'react-redux';
// import React from 'react';
import String from '../../libs/Prismic/components/String';
import { ClickableCard, Grid } from './Styles';
import { DataContext } from '../../context/DataContext';
import { Button } from '../../Theme';
import { useContext } from 'react';


// import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const LevelsTable = (props: any) => {
    const { data, pageStart, pageEnd, lang, earnRewardsCopy } = props;
    const { categories, setIsLoading }: any = useContext(DataContext);
    let navigate = useNavigate();
    // console.log(categories);
    // const router = useRouter();
    // const auth = useSelector(selectCurrentUser);
    // const isLAEUser =
    //     auth?.type?.some((r: any) => ['beneficiary', 'manager'].includes(r)) ??
    //     false;

    return (
        <>
            <Grid>
                {!!data &&
                    data.slice(pageStart, pageEnd).map((elem: any) => {
                        console.log(categories[elem?.category]?.title);
                        
                        return (
                            <ClickableCard
                                heading={elem?.title || ''}
                                content={`${elem?.totalLessons} lessons`}
                                image={elem?.data?.image?.url}
                                label={categories[elem?.category]?.title}
                                onClick={
                                    () => {
                                        setIsLoading(true);
                                        navigate(`/${elem?.uid}`);
                                    }
                                }
                            >
                                <Button fluid style={{marginTop: '.75rem'}}>
                                    {ctaText(
                                        elem?.status,
                                        elem?.data?.reward,
                                        earnRewardsCopy
                                        // isLAEUser
                                    )}
                                </Button>
                            </ClickableCard>
                        );
                    })}
            </Grid>

            {!!!data && !data.length && (
                <Box column fLayout="center" flex w="100%" mt="2rem">
                    <CircledIcon icon="forbidden" medium />

                    <Text g500 medium mt={1}>
                        <String id="noRecordsFounds" />
                    </Text>
                </Box>
            )}
        </>
    );
};

export default LevelsTable;
