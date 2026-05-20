import { useState } from 'react'
import {
  Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from 'react-native'
import OnboardingLayout from '../../components/OnboardingLayout'
import { colors, radius, spacing } from '../../constants/theme'

export default function Step4Bio({ navigation, route }) {
  const [bio, setBio] = useState('')
  const maxLength = 300

  function handleNext() {
    if (bio.trim().length < 20) {
      return Alert.alert('Please write at least 20 characters about yourself')
    }
    navigation.navigate('Step5Prompts', { ...route.params, bio: bio.trim() })
  }

  return (
    <OnboardingLayout
      step={4}
      title="Your story"
      subtitle="Tell people what makes you, you"
      onBack={() => navigation.goBack()}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
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

        <Text style={styles.hint}>
          ✦ Be authentic — people connect with real stories
        </Text>
        <Text style={styles.hint}>
          ✦ Share what excites you about cross-cultural connections
        </Text>
        <Text style={styles.hint}>
          ✦ Keep it warm and approachable
        </Text>

        <TouchableOpacity style={styles.btn} onPress={handleNext}>
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </OnboardingLayout>
  )
}

const styles = StyleSheet.create({
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