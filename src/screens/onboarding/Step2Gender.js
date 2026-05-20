import { useState } from 'react'
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from 'react-native'
import OnboardingLayout from '../../components/OnboardingLayout'
import { colors, radius, spacing } from '../../constants/theme'

const GENDERS = ['Man', 'Woman', 'Non-binary', 'Prefer not to say']
const PREFERENCES = ['Men', 'Women', 'Everyone']

export default function Step2Gender({ navigation, route }) {
  const [gender, setGender] = useState('')
  const [preference, setPreference] = useState('')

  function handleNext() {
    if (!gender) return Alert.alert('Please select your gender')
    if (!preference) return Alert.alert('Please select who you are open to dating')
    navigation.navigate('Step3Nationality', {
      ...route.params,
      gender,
      preference,
    })
  }

  return (
    <OnboardingLayout
      step={2}
      title="About you"
      subtitle="Help us find the right people for you"
      onBack={() => navigation.goBack()}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>I identify as</Text>
        <View style={styles.optionsGrid}>
          {GENDERS.map(g => (
            <TouchableOpacity
              key={g}
              style={[styles.option, gender === g && styles.optionActive]}
              onPress={() => setGender(g)}
            >
              <Text style={[styles.optionText, gender === g && styles.optionTextActive]}>
                {g}
              </Text>
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
              <Text style={[styles.optionText, preference === p && styles.optionTextActive]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleNext}>
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </OnboardingLayout>
  )
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 13,
    color: colors.taupeLight,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
    letterSpacing: 0.5,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  option: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 0.5,
    borderColor: colors.line,
    backgroundColor: colors.obsidian2,
  },
  optionActive: {
    backgroundColor: colors.champagne,
    borderColor: colors.champagne,
  },
  optionText: {
    color: colors.taupeLight,
    fontSize: 14,
  },
  optionTextActive: {
    color: colors.obsidian,
    fontWeight: '500',
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