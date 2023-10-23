import { Box, CircledIcon, Text } from '@impact-market/ui';
import { ctaText } from '../../helpers/Helpers';
// import String from '../../libs/Prismic/components/String';
import { ClickableCard, Grid } from './Styles';
import { DataContext } from '../../context/DataContext';
import { Button } from '../../Theme';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const LevelsTable = (props: any) => {
    const { data, pageStart, pageEnd, earnRewardsCopy } = props;
    const { categories, setIsLoading }: any = useContext(DataContext);
    const navigate = useNavigate();

    return (
        <>
            <Grid>
                {!!data &&
                    data.slice(pageStart, pageEnd).map((elem: any) => {
                        return (
                            <ClickableCard
                                heading={elem?.title || ''}
                                content={`${elem?.totalLessons} lessons`}
                                image={elem?.data?.image?.url}
                                label={categories[elem?.category]?.title}
                                onClick={() => {
                                    setIsLoading(true);
                                    navigate(`/${elem?.uid}`);
                                }}
                            >
                                <Button fluid style={{ marginTop: '.75rem' }}>
                                    {ctaText(
                                        elem?.status,
                                        elem?.data?.reward,
                                        elem?.asset,
                                        earnRewardsCopy
                                    )}
                                </Button>
                            </ClickableCard>
                        );
                    })}
            </Grid>

            {!data && !data.length && (
                <Box column fLayout="center" flex w="100%" mt="2rem">
                    <CircledIcon icon="forbidden" medium />

                    <Text g500 medium mt={1}>
                        {/* <String id="noRecordsFounds" /> */}
                        {'No records found'}
                    </Text>
                </Box>
            )}
        </>
    );
};

export default LevelsTable;
