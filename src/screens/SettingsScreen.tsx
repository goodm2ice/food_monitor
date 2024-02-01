import { memo } from 'react'
import { Switch } from 'react-native-paper'

interface SettingsScreenProps {
    navigation: any
}

export const SettingsScreen = memo<SettingsScreenProps>(({ navigation }) => {
    
    return (
        <Switch />
    )
})

export default SettingsScreen
