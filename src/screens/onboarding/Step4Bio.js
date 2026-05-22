import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from 'react-native'
import { colors, radius, spacing } from '../../constants/theme'
import { DiagonalWeave } from '../../components/OnboardingLayout'

export default function Step4Bio({ navigation, route }) {
  const [bio, setBio] = useState('')
  const maxLength = 300
  const params = route.params || {}

  function handleNext() {
    if (bio.trim().length < 20) {
      return Alert.alert('Please write at least 20 characters about yourself')
    }
    navigation.navigate('Step5Prompts', { ...params, bio: bio.trim() })
  }

  return (
    <View style={styles.wrapper}>
      <DiagonalWeave />

      <View style={styles.progressRow}>
        {Array.from({ length: 8 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressSegment,
              i < 4 ? styles.progressActive : styles.progressInactive,
            ]}
          />
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.logo}>Neli</Text>
          <Text style={styles.title}>Your story</Text>
          <Text style={styles.subtitle}>Tell people what makes you, you</Text>
        </View>

        <TextInput
          style={styles.bioInput}
          value={bio}
          onChangeText={t => t.length <= maxLength && setBio(t)}
          placeholder="I'm someone who loves exploring different cultures, trying new foods, and having deep conversations over coffee..."
          placeholderTextColor={colors.taupeLight}
          multiline
          textAlignVertical="top"
        />
        <Text style={styles.counter}>{bio.length}/{maxLength}</Text>

        <Text style={styles.hint}>✦ Be authentic — people connect with real stories</Text>
        <Text style={styles.hint}>✦ Share what excites you about cross-cultural connections</Text>
        <Text style={styles.hint}>✦ Keep it warm and approachable</Text>

        <TouchableOpacity style={styles.btn} onPress={handleNext}>
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scroll: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    paddingTop: spacing.md,
    marginBottom: spacing.lg,
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
  },
  bioInput: {
    backgroundColor: colors.obsidian2,
    borderWidth: 0.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.parch,
    fontSize: 15,
    minHeight: 160,
    marginBottom: spacing.xs,
    lineHeight: 22,
  },
  counter: {
    fontSize: 11,
    color: colors.taupeLight,
    textAlign: 'right',
    marginBottom: spacing.lg,
    opacity: 0.6,
  },
  hint: {
    fontSize: 12,
    color: colors.taupeLight,
    marginBottom: spacing.sm,
    lineHeight: 18,
    opacity: 0.7,
  },
  btn: {
    backgroundColor: colors.champagne,
    padding: spacing.md,
    borderRadius: radius.full,
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  btnText: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 18,
    color: colors.obsidian,
  },
})