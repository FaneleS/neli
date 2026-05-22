import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, FlatList, Alert
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
  { name: 'Madagascar', flag: '🇲🇬' },
  { name: 'Senegal', flag: '🇸🇳' },
  { name: 'Ivory Coast', flag: '🇨🇮' },
  { name: 'Cameroon', flag: '🇨🇲' },
  { name: 'Angola', flag: '🇦🇴' },
  { name: 'Mozambique', flag: '🇲🇿' },
  { name: 'Rwanda', flag: '🇷🇼' },
  { name: 'Somalia', flag: '🇸🇴' },
  { name: 'Sudan', flag: '🇸🇩' },
  { name: 'Tunisia', flag: '🇹🇳' },
  { name: 'Algeria', flag: '🇩🇿' },
  { name: 'Libya', flag: '🇱🇾' },
  { name: 'Pakistan', flag: '🇵🇰' },
  { name: 'Bangladesh', flag: '🇧🇩' },
  { name: 'Sri Lanka', flag: '🇱🇰' },
  { name: 'Indonesia', flag: '🇮🇩' },
  { name: 'Malaysia', flag: '🇲🇾' },
  { name: 'Philippines', flag: '🇵🇭' },
  { name: 'Thailand', flag: '🇹🇭' },
  { name: 'Vietnam', flag: '🇻🇳' },
  { name: 'South Korea', flag: '🇰🇷' },
  { name: 'Turkey', flag: '🇹🇷' },
  { name: 'Saudi Arabia', flag: '🇸🇦' },
  { name: 'UAE', flag: '🇦🇪' },
  { name: 'Israel', flag: '🇮🇱' },
  { name: 'Greece', flag: '🇬🇷' },
  { name: 'Poland', flag: '🇵🇱' },
  { name: 'Ukraine', flag: '🇺🇦' },
  { name: 'Russia', flag: '🇷🇺' },
  { name: 'Colombia', flag: '🇨🇴' },
  { name: 'Peru', flag: '🇵🇪' },
  { name: 'Chile', flag: '🇨🇱' },
  { name: 'Venezuela', flag: '🇻🇪' },
  { name: 'Cuba', flag: '🇨🇺' },
  { name: 'Haiti', flag: '🇭🇹' },
  { name: 'Jamaica', flag: '🇯🇲' },
  { name: 'Trinidad and Tobago', flag: '🇹🇹' },
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
    <View style={styles.wrapper}>
      <OnboardingLayout
        step={3}
        title="Your nationality"
        subtitle="Celebrate where you're from"
        onBack={() => navigation.goBack()}
      >
        <View style={styles.inner}>
          <TextInput
            style={styles.search}
            value={search}
            onChangeText={setSearch}
            placeholder="Search country..."
            placeholderTextColor={colors.taupeLight}
          />
          <FlatList
            data={filtered}
            keyExtractor={item => item.name}
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item: c }) => (
              <TouchableOpacity
                style={[
                  styles.countryRow,
                  selected?.name === c.name && styles.countryRowActive
                ]}
                onPress={() => setSelected(c)}
              >
                <Text style={styles.flag}>{c.flag}</Text>
                <Text style={[
                  styles.countryName,
                  selected?.name === c.name && styles.countryNameActive
                ]}>
                  {c.name}
                </Text>
                {selected?.name === c.name && (
                  <Text style={styles.check}>✓</Text>
                )}
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.btn} onPress={handleNext}>
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </OnboardingLayout>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  inner: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  search: {
    backgroundColor: colors.obsidian2,
    borderWidth: 0.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.parch,
    fontSize: 15,
    marginBottom: spacing.md,
    flexShrink: 0,
  },
  list: {
    flex: 1,
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
    flexShrink: 0,
  },
  btnText: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 18,
    color: colors.obsidian,
  },
})