import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from 'react-native'
import OnboardingLayout from '../../components/OnboardingLayout'
import { colors, radius, spacing } from '../../constants/theme'

const COUNTRIES = [
  { name: 'South Africa', flag: '🇿🇦' },
  { name: 'Nigeria', flag: '🇳🇬' },
  { name: 'Kenya', flag: '🇰🇪' },
  { name: 'Ghana', flag: '🇬🇭' },
  { name: 'Ethiopia', flag: '🇪🇹' },
  { name: 'United States', flag: '🇺🇸' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Brazil', flag: '🇧🇷' },
  { name: 'India', flag: '🇮🇳' },
  { name: 'China', flag: '🇨🇳' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Mexico', flag: '🇲🇽' },
  { name: 'Argentina', flag: '🇦🇷' },
  { name: 'Egypt', flag: '🇪🇬' },
  { name: 'Morocco', flag: '🇲🇦' },
  { name: 'Tanzania', flag: '🇹🇿' },
  { name: 'Uganda', flag: '🇺🇬' },
  { name: 'Zimbabwe', flag: '🇿🇼' },
  { name: 'Zambia', flag: '🇿🇲' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'Sweden', flag: '🇸🇪' },
  { name: 'Norway', flag: '🇳🇴' },
  { name: 'New Zealand', flag: '🇳🇿' },
]

export default function Step3Nationality({ navigation, route }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  function handleNext() {
    if (!selected) return Alert.alert('Please select your nationality')
    navigation.navigate('Step4Bio', {
      ...route.params,
      nationality: selected.name,
      countryFlag: selected.flag,
    })
  }

  return (
    <OnboardingLayout
      step={3}
      title="Your nationality"
      subtitle="Celebrate where you're from"
      onBack={() => navigation.goBack()}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.search}
          value={search}
          onChangeText={setSearch}
          placeholder="Search country..."
          placeholderTextColor={colors.taupeLight}
        />
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={styles.list}
          keyboardShouldPersistTaps="handled"
        >
          {filtered.map(c => (
            <TouchableOpacity
              key={c.name}
              style={[styles.countryRow, selected?.name === c.name && styles.countryRowActive]}
              onPress={() => setSelected(c)}
            >
              <Text style={styles.flag}>{c.flag}</Text>
              <Text style={[styles.countryName, selected?.name === c.name && styles.countryNameActive]}>
                {c.name}
              </Text>
              {selected?.name === c.name && (
                <Text style={styles.check}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.btn} onPress={handleNext}>
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </OnboardingLayout>
  )
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: colors.obsidian2,
    borderWidth: 0.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.parch,
    fontSize: 15,
    marginBottom: spacing.md,
  },
  list: {
    flex: 1,
    marginBottom: spacing.md,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: 4,
    backgroundColor: colors.obsidian2,
    borderWidth: 0.5,
    borderColor: colors.line,
  },
  countryRowActive: {
    borderColor: colors.champagne,
    backgroundColor: 'rgba(232,213,163,0.08)',
  },
  flag: {
    fontSize: 22,
    marginRight: spacing.md,
  },
  countryName: {
    flex: 1,
    fontSize: 15,
    color: colors.taupeLight,
  },
  countryNameActive: {
    color: colors.champagne,
  },
  check: {
    color: colors.champagne,
    fontSize: 16,
  },
  btn: {
    backgroundColor: colors.champagne,
    padding: spacing.md,
    borderRadius: radius.full,
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  btnText: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 18,
    color: colors.obsidian,
  },

  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
})