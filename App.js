import { useCallback } from 'react'
import { View } from 'react-native'
import { useFonts, Italiana_400Regular } from '@expo-google-fonts/italiana'
import * as SplashScreen from 'expo-splash-screen'
import 'react-native-url-polyfill/auto'
import RootNavigator from './src/navigation/RootNavigator'

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [fontsLoaded] = useFonts({ Italiana_400Regular })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync()
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <RootNavigator />
    </View>
  )
}