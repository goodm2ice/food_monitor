import { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { ClientSettings } from '../types/ClientSettings'

const REQUIRED_SETTING_KEYS = ['weight', 'height', 'age', 'goal', 'cmi']

let settings: ClientSettings | null = null

export const useClientSettings = () => {
    const [parsingError, setParsingError] = useState(false)

    const updateSettings = useCallback(() => {
        AsyncStorage.getItem('client-settings').then((rawSettings) => {
            if (rawSettings === null || typeof rawSettings === 'undefined')
                throw new Error()
            const newSettings = JSON.parse(rawSettings)
            if (
                typeof newSettings !== 'object' ||
                newSettings === null ||
                Object.keys(newSettings).some((key) => !REQUIRED_SETTING_KEYS.includes(key))
            )
                throw new Error()
            console.log(newSettings)
            settings = newSettings
            setParsingError(false)
        }).catch(() => {
            settings = null
            setParsingError(true)
        })
    }, [])

    useEffect(updateSettings, [updateSettings])

    return [settings, updateSettings, parsingError] as const
}
