import { Box } from '@impact-market/ui';
import Input from './Input';

import { useSearchParams } from 'react-router-dom';

let timeoutFilter = setTimeout(() => {}, 0);

interface FilterProps {
    property: string;
    maxW?: number;
    margin?: string;
}

const Filters = (props: FilterProps) => {
    const { property, maxW, margin } = props;
    const [searchParams, setSearchParams] = useSearchParams();

    const onInputChange = (
        field: string,
        value: string | number,
        timeout: number = 0
    ) => {
        if (timeoutFilter) clearTimeout(timeoutFilter);
        timeoutFilter = setTimeout(() => {
            const newSearchParams = { ...Object.fromEntries(searchParams), ...{ [field]: value } }
            setSearchParams(newSearchParams as any)}, timeout);
    };

    return (
        <Box style={{margin: `${margin}`, maxWidth: `${maxW}`, width: '100%'}}>
            <Input
                icon="search"
                onKeyUp={(e: any) =>
                    onInputChange(property, e.target.value, 500)
                }
                // placeholder={t('searchForName')}
            />
        </Box>
    );
};

export default Filters;
