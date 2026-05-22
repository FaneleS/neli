import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, ActivityIndicator
} from 'react-native'
import { supabase } from '../../../lib/supabase'
import { colors, radius, spacing } from '../../constants/theme'
import { DiagonalWeave } from '../../components/OnboardingLayout'

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignIn() {
    if (!email || !password) {
      return Alert.alert('Please fill in all fields')
    }
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      Alert.alert('Sign in failed', error.message)
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainApp' }],
      })
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <DiagonalWeave />
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.logo}>Neli</Text>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Sign in to continue your story</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          placeholderTextColor={colors.taupeLight}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Your password"
          placeholderTextColor={colors.taupeLight}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.btnPrimary, loading && styles.btnDisabled]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={colors.obsidian} />
            : <Text style={styles.btnPrimaryText}>Sign in</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.switchText}>
            Don't have an account? <Text style={styles.switchLink}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.obsidian },
  content: { padding: spacing.lg, paddingTop: 60 },
  back: { marginBottom: spacing.lg },
  backText: { color: colors.champagne, fontSize: 14 },
  logo: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 42,
    color: colors.champagne,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 22,
    color: colors.parch,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  subtitle: { fontSize: 14, color: colors.taupeLight, marginBottom: spacing.xl },
  form: { gap: spacing.sm },
  label: { fontSize: 12, color: colors.taupeLight, marginBottom: 4 },
  input: {
    backgroundColor: colors.obsidian2,
    borderWidth: 0.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.parch,
    fontSize: 15,
    marginBottom: spacing.sm,
  },
  btnPrimary: {
    backgroundColor: colors.champagne,
    padding: spacing.md,
    borderRadius: radius.full,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  btnDisabled: { opacity: 0.6 },
  btnPrimaryText: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 18,
    color: colors.obsidian,
  },
  switchText: {
    color: colors.taupeLight,
    textAlign: 'center',
    fontSize: 13,
    marginTop: spacing.md,
  },
  switchLink: { color: colors.champagne },
})