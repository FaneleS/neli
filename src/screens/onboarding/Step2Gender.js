import { useState } from 'react'
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from 'react-native'
import { colors, radius, spacing } from '../../constants/theme'
import { DiagonalWeave } from '../../components/OnboardingLayout'

const GENDERS = ['Man', 'Woman', 'Non-binary', 'Prefer not to say']
const PREFERENCES = ['Men', 'Women', 'Everyone']

export default function Step2Gender({ navigation, route }) {
  const [gender, setGender] = useState('')
  const [preference, setPreference] = useState('')

  function handleNext() {
    if (!gender) return Alert.alert('Please select your gender')
    if (!preference) return Alert.alert('Please select who you are open to dating')
    navigation.navigate('Step3Nationality', { ...route.params, gender, preference })
  }

  return (
    <View style={styles.wrapper}>
      <DiagonalWeave />
      <View style={styles.progressRow}>
        {Array.from({ length: 8 }).map((_, i) => (
          <View key={i} style={[styles.progressSegment, i < 2 ? styles.progressActive : styles.progressInactive]} />
        ))}
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.logo}>Neli</Text>
          <Text style={styles.title}>About you</Text>
          <Text style={styles.subtitle}>Help us find the right people for you</Text>
        </View>

        <Text style={styles.sectionLabel}>I identify as</Text>
        <View style={styles.optionsGrid}>
          {GENDERS.map(g => (
            <TouchableOpacity
              key={g}
              style={[styles.option, gender === g && styles.optionActive]}
              onPress={() => setGender(g)}
            >
              <Text style={[styles.optionText, gender === g && styles.optionTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>I am open to dating</Text>
        <View style={styles.optionsGrid}>
          {PREFERENCES.map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.option, preference === p && styles.optionActive]}
              onPress={() => setPreference(p)}
            >
              <Text style={[styles.optionText, preference === p && styles.optionTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

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
  sectionLabel: { fontSize: 13, color: colors.taupeLight, marginBottom: spacing.sm, marginTop: spacing.sm, letterSpacing: 0.5 },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  option: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.full, borderWidth: 0.5, borderColor: colors.line, backgroundColor: colors.obsidian2 },
  optionActive: { backgroundColor: colors.champagne, borderColor: colors.champagne },
  optionText: { color: colors.taupeLight, fontSize: 14 },
  optionTextActive: { color: colors.obsidian, fontWeight: '500' },
  btn: { backgroundColor: colors.champagne, padding: spacing.md, borderRadius: radius.full, alignItems: 'center', marginTop: spacing.sm, marginBottom: spacing.lg },
  btnText: { fontFamily: 'Italiana_400Regular', fontSize: 18, color: colors.obsidian },
})