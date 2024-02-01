import { memo } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Text } from 'react-native-paper'

import DailyPFC from './calculator_screens/DailyPFC'

const Drawer = createDrawerNavigator()

const SCREENS = [
    { name: 'pfc', title: 'Суточное БЖУ', component: DailyPFC },
]

export const CalculatorsPage = memo(() => {

    return (
        <Drawer.Navigator>
            {SCREENS.map(({ name, title, component }) => (
                <Drawer.Screen
                    key={name}
                    name={name}
                    component={component}
                    options={{ title }}
                />
            ))}
        </Drawer.Navigator>
    )
})

export default CalculatorsPage
