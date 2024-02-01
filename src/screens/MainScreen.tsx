import { memo, useEffect, useState } from 'react'
import { BottomNavigation } from 'react-native-paper'

import ProductsPage from '../pages/ProductsPage'
import DishesPage from '../pages/DishesPage'
import HomePage from '../pages/HomePage'
import CalculatorsPage from '../pages/CalculatorsPage'
import { useClientSettings } from '../hooks/useClientSettings'

const routes = [
    { key: 'settings', title: 'Настройки', focusedIcon: 'cog' },
    { key: 'calculators', title: 'Расчёты', focusedIcon: 'calculator-variant' },
    { key: 'home', title: 'Главная', focusedIcon: 'home' },
    { key: 'dishes', title: 'Блюда', focusedIcon: 'food-turkey' },
    { key: 'products', title: 'Продукты', focusedIcon: 'food-apple' },
]

const renderScene = BottomNavigation.SceneMap({
    calculators: CalculatorsPage,
    home: HomePage,
    dishes: DishesPage,
    products: ProductsPage,
})

interface MainScreenProps {
    navigation: any
}

export const MainScreen = memo<MainScreenProps>(({ navigation }) => {
    const [index, setIndex] = useState(2)
    const [_, updateSettings, settingsError] = useClientSettings()

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', updateSettings)

        return unsubscribe
    }, [navigation, updateSettings])

    useEffect(() => {
        if (settingsError)
            navigation.navigate('start')
    }, [settingsError, navigation])

    return (
        <>
            <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
            />
        </>
    )
})

export default MainScreen
