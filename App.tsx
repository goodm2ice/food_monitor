import { SafeAreaView, StyleSheet } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import StartScreen from './src/screens/StartScreen'
import MainScreen from './src/screens/MainScreen'
import SettingsScreen from './src/screens/SettingsScreen'

const { Navigator, Screen } = createNativeStackNavigator()

export default function App() {

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <NavigationContainer>
                    <Navigator initialRouteName={'main'}>
                        <Screen name={'main'} component={MainScreen} options={{ headerShown: false }} />
                        <Screen name={'start'} component={StartScreen} options={{ title: 'Начало пути' }} />
                        <Screen name={'settings'} component={SettingsScreen} />
                    </Navigator>
                </NavigationContainer>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({ container: { flex: 1 } })
