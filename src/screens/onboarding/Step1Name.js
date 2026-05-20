import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from 'react-native'
import OnboardingLayout from '../../components/OnboardingLayout'
import { colors, radius, spacing } from '../../constants/theme'

export default function Step1Name({ navigation }) {
  const [fullName, setFullName] = useState('')
  const [dob, setDob] = useState('')

  function formatDOB(text) {
    const cleaned = text.replace(/\D/g, '')
    if (cleaned.length <= 2) return cleaned
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`
  }

  function handleNext() {
    if (!fullName.trim()) return Alert.alert('Please enter your full name')
    if (dob.length < 10) return Alert.alert('Please enter a valid date of birth')

    const parts = dob.split('/')
    const birthYear = parseInt(parts[2])
    const currentYear = new Date().getFullYear()
    const age = currentYear - birthYear

    if (age < 18) return Alert.alert('You must be 18 or older to use Neli')
    if (age > 100) return Alert.alert('Please enter a valid date of birth')

    navigation.navigate('Step2Gender', { fullName: fullName.trim(), dob })
  }

  return (
    <OnboardingLayout
      step={1}
      title="What's your name?"
      subtitle="This is how you'll appear to others on Neli"
      onBack={() => navigation.goBack()}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Full name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Your full name"
          placeholderTextColor={colors.taupeLight}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Date of birth</Text>
        <TextInput
          style={styles.input}
          value={dob}
          onChangeText={t => setDob(formatDOB(t))}
          placeholder="DD/MM/YYYY"
          placeholderTextColor={colors.taupeLight}
          keyboardType="numeric"
          maxLength={10}
        />
        <Text style={styles.hint}>You must be 18 or older to use Neli</Text>

        <TouchableOpacity style={styles.btn} onPress={handleNext}>
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </OnboardingLayout>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    color: colors.taupeLight,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.obsidian2,
    borderWidth: 0.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.parch,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  hint: {
    fontSize: 11,
    color: colors.taupeLight,
    marginBottom: spacing.xl,
    opacity: 0.6,
  },
  btn: {
    backgroundColor: colors.champagne,
    padding: spacing.md,
    borderRadius: radius.full,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  btnText: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 18,
    color: colors.obsidian,
  },
})