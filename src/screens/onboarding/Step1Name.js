import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from 'react-native'
import { colors, radius, spacing } from '../../constants/theme'
import { DiagonalWeave } from '../../components/OnboardingLayout'

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
    <View style={styles.wrapper}>
      <DiagonalWeave />
      <View style={styles.progressRow}>
        {Array.from({ length: 8 }).map((_, i) => (
          <View key={i} style={[styles.progressSegment, i < 1 ? styles.progressActive : styles.progressInactive]} />
        ))}
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.logo}>Neli</Text>
          <Text style={styles.title}>What's your name?</Text>
          <Text style={styles.subtitle}>This is how you'll appear to others on Neli</Text>
        </View>

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
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: colors.obsidian },
  progressRow: { flexDirection: 'row', gap: 4, paddingHorizontal: spacing.lg, paddingTop: 52, zIndex: 1 },
  progressSegment: { flex: 1, height: 2, borderRadius: 2 },
  progressActive: { backgroundColor: colors.champagne },
  progressInactive: { backgroundColor: colors.line },
  scroll: { flex: 1, zIndex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  header: { paddingTop: spacing.md, marginBottom: spacing.lg },
  backText: { color: colors.champagne, fontSize: 14, marginBottom: spacing.sm },
  logo: { fontFamily: 'Italiana_400Regular', fontSize: 28, color: colors.champagne, marginBottom: spacing.xs },
  title: { fontSize: 24, fontWeight: '500', color: colors.parch, marginBottom: 4 },
  subtitle: { fontSize: 13, color: colors.taupeLight, lineHeight: 20 },
  label: { fontSize: 12, color: colors.taupeLight, marginBottom: 6, letterSpacing: 0.5 },
  input: {
    backgroundColor: colors.obsidian2, borderWidth: 0.5, borderColor: colors.line,
    borderRadius: radius.md, padding: spacing.md, color: colors.parch, fontSize: 16, marginBottom: spacing.md,
  },
  hint: { fontSize: 11, color: colors.taupeLight, marginBottom: spacing.xl, opacity: 0.6 },
  btn: { backgroundColor: colors.champagne, padding: spacing.md, borderRadius: radius.full, alignItems: 'center', marginTop: spacing.sm, marginBottom: spacing.lg },
  btnText: { fontFamily: 'Italiana_400Regular', fontSize: 18, color: colors.obsidian },
})