import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Button, Divider, RadioButton, SegmentedButtons, Snackbar, Switch, Text, TextInput } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'

import NumericInput from '../components/NumericInput'
import { Activity, ClientSettings, Sex, WeightGoal } from '../types/ClientSettings'

interface StartScreenProps {
    navigation: any
}

const AMR_K = {
    [Activity.Sedentary]: 1.2,
    [Activity.LightlyActive]: 1.375,
    [Activity.ModeratelyActive]: 1.55,
    [Activity.Active]: 1.725,
    [Activity.VeryActive]: 1.9,
}

const FAT_KG_CALORIE = 7700

const makeButton = (value: string, label: string, icon?: string) => ({ value, label, icon })
const SEX_BUTTONS = [makeButton(Sex.Male, 'Мужчина', 'gender-male'), makeButton(Sex.Female, 'Женщина', 'gender-female')]
const ACTIVITY_BUTTONS = [
    makeButton(Activity.Sedentary, 'Сидячий образ жизни\n(мало физических упражнений или их отсутствие)'),
    makeButton(Activity.LightlyActive, 'Легкая активность (тренировки 1-3 дней в неделю)'),
    makeButton(Activity.ModeratelyActive, 'Умеренная активность\n(тренировки 3–5 дней в неделю)'),
    makeButton(Activity.Active, 'Активность (тренировки 6-7 дней в неделю)'),
    makeButton(Activity.VeryActive, 'Высокая активность\n(тяжёлые тренировки 6–7 дней в неделю)'),
]

const GOAL_BUTTONS = [
    makeButton(WeightGoal.Loss, 'Похудение'),
    makeButton(WeightGoal.Maintenance, 'Поддержание'),
    makeButton(WeightGoal.Gain, 'Набор'),
]

export const StartScreen = memo<StartScreenProps>(({ navigation }) => {
    const [verbose, setVerbose] = useState<boolean>(false)

    const [height, setHeight] = useState<number>()
    const [weight, setWeight] = useState<number>()
    const [age, setAge] = useState<number>()
    const [sex, setSex] = useState<Sex>(Sex.Male)

    const [activity, setActivity] = useState<Activity>(Activity.LightlyActive)
    const [amr, setAmr] = useState<number>()
    
    const [goal, setGoal] = useState<WeightGoal>(WeightGoal.Maintenance)
    const [weightChange, setWeightChange] = useState<number>()
    const [goalDays, setGoalDays] = useState<number>()
    const [cmi, setCmi] = useState<number>()

    const [fillingError, setFillingError] = useState<string | null>(null)

    const bmr = useMemo(() => {
        if (
            typeof weight === 'undefined' || !Number.isFinite(weight) ||
            typeof height === 'undefined' || !Number.isFinite(height) ||
            typeof age === 'undefined' || !Number.isFinite(age)
        ) return undefined

        return (sex === Sex.Male ? 5 : -161) + (10 * weight) + (6.25 * height) + (5 * age)
    }, [weight, height, age, sex])

    const onFinishPress = useCallback(async () => {
        const fillingErrorList = []
        if (typeof weight === 'undefined')
            fillingErrorList.push('Вес не указан')
        if (typeof height === 'undefined')
            fillingErrorList.push('Рост не указан')
        if (typeof age === 'undefined')
            fillingErrorList.push('Возраст не указан')
        if (typeof amr === 'undefined')
            fillingErrorList.push('АОВ не указан')
        if (goal !== WeightGoal.Maintenance) {
            if (typeof weightChange === 'undefined')
                fillingErrorList.push('Цель не указана')
            if (typeof goalDays === 'undefined')
                fillingErrorList.push('Дни достижения цели не указаны')
        }
        if (typeof cmi === 'undefined')
            fillingErrorList.push('СНК не указано')

        if (fillingErrorList.length > 1) {
            setFillingError(['При попытке сохранить данные возникли следующие ошибки:', ...fillingErrorList].join('\n* '))
            return
        }

        const saveData: ClientSettings = {
            sex,
            activity,
            weight: weight as number,
            height: height as number,
            age: age as number,
            cmi: cmi as number,
            goal: { type: WeightGoal.Maintenance },
        }

        if (goal !== WeightGoal.Maintenance) {
            saveData.goal = {
                type: goal,
                change: weightChange as number,
                days: goalDays as number,
            }
        }

        try {
            await AsyncStorage.setItem('client-settings', JSON.stringify(saveData))
            navigation.navigate('main')
        } catch (e) {
            setFillingError(`Неизвестная ошибка при сохранении данных: ${e}`)
        }
    }, [sex, weight, height, age, activity, amr, goal, weightChange, goalDays, cmi, navigation])

    useEffect(() => {
        setAmr(typeof bmr !== 'undefined' ? bmr * AMR_K[activity] : undefined)
    }, [bmr, activity])

    useEffect(() => {
        if (typeof height === 'undefined' || typeof weight === 'undefined') return

        const normalWeight = (height - (sex === Sex.Male ? 100 : 110)) * 1.15

        const k = normalWeight / weight
        if (k < 0.9) {
            setGoal(WeightGoal.Loss)
            setWeightChange(weight - normalWeight)
        } else if (k > 1.1) {
            setGoal(WeightGoal.Gain)
            setWeightChange(normalWeight - weight)
        } else {
            setGoal(WeightGoal.Maintenance)
        }
    }, [weight, height, sex])

    useEffect(() => {
        if (goal === WeightGoal.Maintenance) {
            setCmi(amr)
            return
        }

        if (
            typeof weight === 'undefined' ||
            typeof weightChange === 'undefined' ||
            typeof goalDays === 'undefined' ||
            typeof amr === 'undefined'
        ) {
            setCmi(undefined)
            return
        }

        const offset = (goal === WeightGoal.Loss ? -1 : 1) * weightChange * FAT_KG_CALORIE / goalDays

        setCmi(Math.max(amr + offset, 0))
    }, [weight, weightChange, goalDays, amr, goal])

    useEffect(() => {
        if (typeof weightChange === 'undefined') return

        if (goal === WeightGoal.Loss)
            setGoalDays(Math.ceil(weightChange * FAT_KG_CALORIE / 1000))
        else if (goal === WeightGoal.Gain)
            setGoalDays(Math.ceil(weightChange * FAT_KG_CALORIE / 4000))
    }, [goal, weightChange])

    return (
        <ScrollView contentContainerStyle={styles.page}>
            <Text variant={'titleLarge'}>
                Пожалуйста, заполняйте данные сверху вниз во избежание борьбы с автозаполнением!
            </Text>
            <View style={styles.switch}>
                <Text>Показать дополнительную информацию</Text>
                <Switch value={verbose} onValueChange={setVerbose} />
            </View>
            <Text>Пол:</Text>
            <SegmentedButtons
                buttons={SEX_BUTTONS}
                value={sex}
                onValueChange={(value) => setSex(value as Sex)}
                style={{ marginBottom: 5 }}
            />
            <NumericInput label={'Вес'} affixText={'кг'} value={weight} onChange={setWeight} required />
            <NumericInput label={'Рост'} affixText={'см'} value={height} onChange={setHeight} required />
            <NumericInput label={'Возраст'} affixText={'лет'} value={age} onChange={setAge} type={'int'} required />
            {verbose && (
                <NumericInput disabled label={'Базовый обмен веществ'} affixText={'кКал'} value={bmr} />
            )}
            <Divider style={styles.space} />
            <Text>Уровень активности:</Text>
            <RadioButton.Group value={activity} onValueChange={(value) => setActivity(value as Activity)}>
                {ACTIVITY_BUTTONS.map(({ value, label }) => (
                    <View key={value} style={styles.radioButton}>
                        <RadioButton value={value} />
                        <Text>{label}</Text>
                    </View>
                ))}
            </RadioButton.Group>
            {verbose && (
                <NumericInput
                    label={'Активный обмен веществ'}
                    affixText={'кКал'}
                    value={amr}
                    onChange={setAmr}
                    required
                />
            )}
            <Divider style={styles.space} />
            <Text>Ваша текущая цель:</Text>
            <SegmentedButtons
                buttons={GOAL_BUTTONS}
                value={goal}
                onValueChange={(value) => setGoal(value as WeightGoal)}
                style={{ marginBottom: 5 }}
            />
            {goal !== WeightGoal.Maintenance && (
                <>
                    <NumericInput
                        label={`${goal === WeightGoal.Loss ? 'Похудеть на' : 'Набрать'}`}
                        affixText={'кг'}
                        min={0}
                        value={weightChange}
                        onChange={setWeightChange}
                        required
                    />
                    <NumericInput
                        label={'В течение'}
                        affixText={'дней'}
                        type={'int'}
                        min={1}
                        value={goalDays}
                        onChange={setGoalDays}
                        required
                    />
                </>
            )}
            {verbose && (
                <>
                    <Text>В одном килограмме жира ~7700 кКал</Text>
                    <Text>Корректируем рацион в соответствии разницей веса в кКал делённое на количество дней</Text>
                </>
            )}
            <Divider style={styles.space} />
            <NumericInput
                label={'Суточная норма калорий'}
                right={<TextInput.Affix text={'кКал'} />}
                min={0}
                value={cmi}
                onChange={setCmi}
                required
            />
            <Button
                style={{ marginTop: 10 }}
                mode={'contained'}
                onPress={onFinishPress}
            >
                Поехали!
            </Button>
            <Snackbar visible={fillingError !== null} onDismiss={() => setFillingError(null)}>
                {fillingError}
            </Snackbar>
        </ScrollView>
    )
})

const styles = StyleSheet.create({
    page: { marginHorizontal: 10, paddingVertical: 20 },
    space: { marginVertical: 10 },
    radioButton: { flexDirection: 'row', alignItems: 'center' },
    switch: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
})

export default StartScreen
