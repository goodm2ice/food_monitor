import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { TextInput, TextInputProps } from 'react-native-paper'

const NUMERIC_INPUT_TYPES = {
    int: {
        formatter: (value: string) => value.replace(/[^-0-9]/g, ''),
        parser: (value: string) => parseInt(value),
    },
    float: {
        formatter: (value: string) => value.replace(/[,.]+/g, '.').replace(/[^-0-9.]/g, ''),
        parser: (value: string) => parseFloat(value),
    },
}

export type NumericInputProps = Omit<TextInputProps, 'value' | 'onChange' | 'onChangeText' | 'onEndEditing'> & {
    value?: number
    onChange?: (value: number) => void
    type?: keyof typeof NUMERIC_INPUT_TYPES
    min?: number
    max?: number
    fixed?: number
    affixText?: string
    required?: boolean
}

export const NumericInput = memo<NumericInputProps>(({
    value,
    onChange,
    min = -Infinity,
    max = Infinity,
    type = 'float',
    fixed = 0,
    affixText,
    required,
    ...other
}) => {
    const [textValue, setTextValue] = useState<string>('')
    
    const error = useMemo(() => {
        if (!required) return false

        return textValue.trim() === ''
    }, [required, textValue])

    const onChangeText = useCallback((text: string) => {
        setTextValue(NUMERIC_INPUT_TYPES[type].formatter(text))
    }, [type])

    const onFinish = useCallback(() => {
        let output = NUMERIC_INPUT_TYPES[type].parser(textValue)
        output = Math.min(max, Math.max(min, output))

        onChange?.(output)
    }, [type, textValue, onChange, min, max])
    
    useEffect(() => {
        setTextValue(NUMERIC_INPUT_TYPES[type].formatter(value ? value.toFixed(fixed) : ''))
    }, [value, fixed])

    return (
        <>
            <TextInput
                keyboardType={'number-pad'}
                right={affixText ? <TextInput.Affix text={affixText} /> : undefined}
                error={error}
                {...other}
                value={textValue}
                onChangeText={onChangeText}
                onEndEditing={onFinish}
            />
        </>
    )
})

export default NumericInput
