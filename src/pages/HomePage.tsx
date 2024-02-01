import { memo } from 'react'
import { Text } from 'react-native-paper'

import { useClientSettings } from '../hooks/useClientSettings'
import { View } from 'react-native'

export const HomePage = memo(() => {
    const [settings, updateSettings] = useClientSettings()

    return (
        <View>
            <View>
                <Text>Вес: {settings?.weight ?? '???'} кг</Text>
            </View>
        </View>
    )
})

export default HomePage
