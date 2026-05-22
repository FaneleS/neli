import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, FlatList, Alert
} from 'react-native'
import { colors, radius, spacing } from '../../constants/theme'
import { DiagonalWeave } from '../../components/OnboardingLayout'

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
  const params = route.params || {}

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
        return Alert.alert('Please answer both prompts', 'Each answer needs at least 10 characters')
      }
    }
    const prompts = selected.map(p => ({ question: p, answer: answers[p].trim() }))
    navigation.navigate('Step6Photos', { ...params, prompts })
  }

  const hasUnanswered = selected.length === 2 &&
    selected.some(p => !answers[p] || answers[p].trim().length < 10)

  const data = [
    { type: 'header' },
    ...PROMPTS.map(p => ({ type: 'prompt', prompt: p })),
  ]

  return (
    <View style={styles.wrapper}>
      <DiagonalWeave />

      <View style={styles.progressRow}>
        {Array.from({ length: 8 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressSegment,
              i < 5 ? styles.progressActive : styles.progressInactive,
            ]}
          />
        ))}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        keyboardShouldPersistTaps="handled"
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return (
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.logo}>Neli</Text>
                <Text style={styles.title}>Your prompts</Text>
                <Text style={styles.subtitle}>Choose 2 prompts to show your personality</Text>
                <Text style={styles.counter}>{selected.length}/2 selected</Text>

                {selected.length < 2 && (
                  <View style={styles.warningBanner}>
                    <Text style={styles.warningText}>
                      Select {2 - selected.length} more prompt{2 - selected.length > 1 ? 's' : ''} below to continue
                    </Text>
                  </View>
                )}

                {hasUnanswered && (
                  <View style={styles.warningBanner}>
                    <Text style={styles.warningText}>
                      Please answer both prompts with at least 10 characters
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.btn, (selected.length < 2 || hasUnanswered) && styles.btnDisabled]}
                  onPress={handleNext}
                >
                  <Text style={styles.btnText}>
                    {selected.length < 2
                      ? `Select ${2 - selected.length} more prompt${2 - selected.length > 1 ? 's' : ''}`
                      : hasUnanswered
                        ? 'Answer both prompts to continue'
                        : 'Continue'
                    }
                  </Text>
                </TouchableOpacity>
              </View>
            )
          }

          const prompt = item.prompt
          const isSelected = selected.includes(prompt)

          return (
            <View style={styles.promptWrapper}>
              <TouchableOpacity
                style={[styles.promptOption, isSelected && styles.promptOptionActive]}
                onPress={() => togglePrompt(prompt)}
              >
                <Text style={[styles.promptText, isSelected && styles.promptTextActive]}>
                  {prompt}
                </Text>
                {isSelected && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>

              {isSelected && (
                <>
                  <TextInput
                    style={styles.answerInput}
                    value={answers[prompt] || ''}
                    onChangeText={t => setAnswers({ ...answers, [prompt]: t })}
                    placeholder="Your answer..."
                    placeholderTextColor={colors.taupeLight}
                    multiline
                    maxLength={150}
                  />
                  {answers[prompt] && answers[prompt].trim().length < 10 && (
                    <Text style={styles.inputWarning}>
                      {10 - answers[prompt].trim().length} more characters needed
                    </Text>
                  )}
                </>
              )}
            </View>
          )
        }}
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
  list: {
    flex: 1,
    zIndex: 1,
  },
  listContent: {
    paddingBottom: 60,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
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
    marginBottom: spacing.sm,
  },
  counter: {
    fontSize: 12,
    color: colors.champagne,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  warningBanner: {
    backgroundColor: 'rgba(232,213,163,0.08)',
    borderWidth: 0.5,
    borderColor: colors.champagne,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  warningText: {
    fontSize: 12,
    color: colors.champagne,
    textAlign: 'center',
  },
  promptWrapper: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  promptOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.line,
    backgroundColor: colors.obsidian2,
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
    marginTop: 4,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    lineHeight: 20,
  },
  inputWarning: {
    fontSize: 10,
    color: colors.rose,
    marginTop: 4,
    marginLeft: 4,
  },
  btn: {
    backgroundColor: colors.champagne,
    padding: spacing.md,
    borderRadius: radius.full,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnText: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 18,
    color: colors.obsidian,
  },
})