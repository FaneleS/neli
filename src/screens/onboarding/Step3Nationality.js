import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, FlatList
} from 'react-native'
import { colors, radius, spacing } from '../../constants/theme'
import { DiagonalWeave } from '../../components/OnboardingLayout'

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

  return (
    <View style={styles.wrapper}>
      <DiagonalWeave />

      <View style={styles.progressRow}>
        {Array.from({ length: 8 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressSegment,
              i < 3 ? styles.progressActive : styles.progressInactive,
            ]}
          />
        ))}
      </View>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.logo}>Neli</Text>
        <Text style={styles.title}>Your nationality</Text>
        <Text style={styles.subtitle}>Tap your country to continue</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.search}
          value={search}
          onChangeText={setSearch}
          placeholder="Search country..."
          placeholderTextColor={colors.taupeLight}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.name}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item: c }) => (
          <TouchableOpacity
            style={[
              styles.countryRow,
              selected?.name === c.name && styles.countryRowActive
            ]}
            onPress={() => {
              setSelected(c)
              navigation.navigate('Step4Bio', {
                ...route.params,
                nationality: c.name,
                countryFlag: c.flag,
              })
            }}
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
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.obsidian,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
    zIndex: 1,
  },
  progressSegment: {
    flex: 1,
    height: 2,
    borderRadius: 2,
  },
  progressActive: {
    backgroundColor: colors.champagne,
  },
  progressInactive: {
    backgroundColor: colors.line,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    zIndex: 1,
  },
  backText: {
    color: colors.champagne,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  logo: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 28,
    color: colors.champagne,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: colors.parch,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.taupeLight,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    zIndex: 1,
  },
  search: {
    backgroundColor: colors.obsidian2,
    borderWidth: 0.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.parch,
    fontSize: 15,
    marginBottom: spacing.sm,
  },
  list: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    zIndex: 1,
  },
  listContent: {
    paddingBottom: spacing.sm,
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
})