import { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import { useFonts, Italiana_400Regular } from '@expo-google-fonts/italiana'
import * as SplashScreen from 'expo-splash-screen'
import 'react-native-url-polyfill/auto'
import RootNavigator from './src/navigation/RootNavigator'
import { supabase } from './lib/supabase'

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [fontsLoaded] = useFonts({ Italiana_400Regular })
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && session !== undefined) await SplashScreen.hideAsync()
  }, [fontsLoaded, session])

  // Wait until session is checked (undefined = not checked yet)
  if (!fontsLoaded || session === undefined) return null

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <RootNavigator session={session} />
    </View>
  )
}