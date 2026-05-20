import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from 'react-native'
import OnboardingLayout from '../../components/OnboardingLayout'
import { colors, radius, spacing } from '../../constants/theme'

const PROMPTS = [
  "The culture I'd love to learn more about is...",
  "A tradition from my background that I love is...",
  "My perfect cross-cultural date looks like...",
  "One thing I want someone to teach me about their culture...",
  "I feel most at home when...",
  "The most beautiful thing about my culture is...",
  "A meal that tells my story is...",
  "I knew I wanted to see the world when...",
  "The language I wish I spoke fluently is...",
  "My culture taught me that...",
]

export default function Step5Prompts({ navigation, route }) {
  const [selected, setSelected] = useState([])
  const [answers, setAnswers] = useState({})

  function togglePrompt(prompt) {
    if (selected.includes(prompt)) {
      setSelected(selected.filter(p => p !== prompt))
      const updated = { ...answers }
      delete updated[prompt]
      setAnswers(updated)
    } else {
      if (selected.length >= 2) {
        return Alert.alert('Choose 2 prompts', 'Please remove one before adding another')
      }
      setSelected([...selected, prompt])
    }
  }

  function handleNext() {
    if (selected.length < 2) return Alert.alert('Please choose 2 prompts')
    for (const p of selected) {
      if (!answers[p] || answers[p].trim().length < 10) {
        return Alert.alert('Please answer both prompts with at least 10 characters')
      }
    }
    const prompts = selected.map(p => ({ question: p, answer: answers[p].trim() }))
    navigation.navigate('Step6Photos', { ...route.params, prompts })
  }

  return (
    <OnboardingLayout
      step={5}
      title="Your prompts"
      subtitle="Choose 2 prompts to show your personality"
      onBack={() => navigation.goBack()}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>
          {selected.length}/2 selected
        </Text>

        {PROMPTS.map(prompt => (
          <View key={prompt}>
            <TouchableOpacity
              style={[
                styles.promptOption,
                selected.includes(prompt) && styles.promptOptionActive
              ]}
              onPress={() => togglePrompt(prompt)}
            >
              <Text style={[
                styles.promptText,
                selected.includes(prompt) && styles.promptTextActive
              ]}>
                {prompt}
              </Text>
              {selected.includes(prompt) && (
                <Text style={styles.check}>✓</Text>
              )}
            </TouchableOpacity>

            {selected.includes(prompt) && (
              <TextInput
                style={styles.answerInput}
                value={answers[prompt] || ''}
                onChangeText={t => setAnswers({ ...answers, [prompt]: t })}
                placeholder="Your answer..."
                placeholderTextColor={colors.taupeLight}
                multiline
                maxLength={150}
              />
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.btn} onPress={handleNext}>
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </OnboardingLayout>
  )
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 12,
    color: colors.champagne,
    marginBottom: spacing.md,
    letterSpacing: 0.5,
  },
  promptOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.line,
    backgroundColor: colors.obsidian2,
    marginBottom: spacing.sm,
  },
  promptOptionActive: {
    borderColor: colors.champagne,
    backgroundColor: 'rgba(232,213,163,0.08)',
  },
  promptText: {
    flex: 1,
    fontSize: 13,
    color: colors.taupeLight,
    lineHeight: 18,
  },
  promptTextActive: {
    color: colors.champagne,
  },
  check: {
    color: colors.champagne,
    fontSize: 16,
    marginLeft: spacing.sm,
  },
  answerInput: {
    backgroundColor: colors.obsidian,
    borderWidth: 0.5,
    borderColor: colors.champagne,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.parch,
    fontSize: 14,
    minHeight: 80,
    marginBottom: spacing.md,
    marginTop: -4,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    lineHeight: 20,
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
})