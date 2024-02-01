import { memo, useMemo } from 'react'
import { Text } from 'react-native-paper'

import DishModel from '../models/Dish'
import { DB_NAME } from '../settings'

export const DishesPage = memo(() => {
    const dishes = useMemo(() => new DishModel(DB_NAME), [])

    return (
        <Text>Dishes Page</Text>
    )
})

export default DishesPage
