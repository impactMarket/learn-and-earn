/* eslint-disable react-hooks/rules-of-hooks */
import {
    Input as BaseInput,
    InputProps as BaseInputProps,
    Text
} from '@impact-market/ui';
import { Controller, useWatch } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
// import useTranslations from '../libs/Prismic/hooks/useTranslations';

type InputProps = {
    control?: any;
    label?: string;
    limit?: number;
    min?: number;
    name?: string;
    rules?: any;
};

const Input: React.FC<InputProps & BaseInputProps> = (props) => {
    const [count, setCount] = useState(0);
    const { control, label, limit, min, name, rules, ...forwardProps } = props;

    // const { t } = useTranslations();

    if (control) {
        const inputWatch = useWatch({ control, name });

        useEffect(() => {
            if (limit > 0) {
                if (inputWatch) {
                    setCount(inputWatch.length);
                } else {
                    setCount(0);
                }
            }
        }, [inputWatch]);
    }

    const setValue = (e: any, onChange: (e: any) => void) => {
        setCount(e.target.value.length);
        onChange(e);
    };

    const renderInput = (field?: any) => {
        return (
            <>
                {label && (
                    <Text g700 mb={0.375} medium small>
                        {label}
                    </Text>
                )}
                <BaseInput
                    maxLength={limit}
                    minLength={min}
                    {...field}
                    onChange={(e: any) => field && setValue(e, field.onChange)}
                    {...forwardProps}
                />
                {field && limit && (
                    <Text g500 mt={0.375} small>
                        {limit - count} {'characters left'}
                        {min && count < min && ` (min ${min})`}
                    </Text>
                )}
            </>
        );
    };

    return (
        <>
            {control ? (
                <Controller
                    control={control}
                    name={name}
                    render={({ field }) => renderInput(field)}
                    rules={rules}
                />
            ) : (
                renderInput()
            )}
        </>
    );
};

export default Input;
