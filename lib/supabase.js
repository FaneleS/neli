import { createClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'
import 'react-native-url-polyfill/auto'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

let storage

if (Platform.OS === 'web') {
  storage = {
    getItem: (key) => {
      try {
        return Promise.resolve(window.localStorage.getItem(key))
      } catch {
        return Promise.resolve(null)
      }
    },
    setItem: (key, value) => {
      try {
        window.localStorage.setItem(key, value)
        return Promise.resolve()
      } catch {
        return Promise.resolve()
      }
    },
    removeItem: (key) => {
      try {
        window.localStorage.removeItem(key)
        return Promise.resolve()
      } catch {
        return Promise.resolve()
      }
    },
  }
} else {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default
  storage = AsyncStorage
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})