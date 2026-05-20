import { useState } from 'react'
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView
} from 'react-native'
import OnboardingLayout from '../../components/OnboardingLayout'
import { colors, radius, spacing } from '../../constants/theme'

const QUESTIONS = [
  {
    id: 'EI',
    question: 'At a social gathering, you are more likely to...',
    emoji: '🎉',
    optionA: { label: 'Meet as many new people as possible', value: 'E' },
    optionB: { label: 'Have deep conversations with a few people', value: 'I' },
  },
  {
    id: 'SN',
    question: 'When you imagine your ideal partner, you focus on...',
    emoji: '💭',
    optionA: { label: 'Who they are right now — their real qualities', value: 'S' },
    optionB: { label: 'Who they could become — their potential', value: 'N' },
  },
  {
    id: 'TF',
    question: 'When a friend has a problem, you usually...',
    emoji: '🤝',
    optionA: { label: 'Help them think through solutions logically', value: 'T' },
    optionB: { label: 'Focus on how they are feeling first', value: 'F' },
  },
  {
    id: 'JP',
    question: 'Your ideal weekend is...',
    emoji: '🌅',
    optionA: { label: 'Planned in advance so you can look forward to it', value: 'J' },
    optionB: { label: 'Spontaneous — you will figure it out as you go', value: 'P' },
  },
  {
    id: 'TIE',
    question: 'When making an important decision, you trust...',
    emoji: '⚖️',
    optionA: { label: 'Your head more than your heart', value: 'T' },
    optionB: { label: 'Your heart more than your head', value: 'F' },
  },
]

const MBTI_TYPES = {
  INTJ: { name: 'The Architect', desc: 'Strategic, independent and driven by logic and vision.' },
  INTP: { name: 'The Thinker', desc: 'Curious, analytical and always seeking deeper understanding.' },
  ENTJ: { name: 'The Commander', desc: 'Bold, decisive and natural born leader.' },
  ENTP: { name: 'The Debater', desc: 'Smart, curious and loves a good intellectual challenge.' },
  INFJ: { name: 'The Advocate', desc: 'Insightful, principled and deeply empathetic.' },
  INFP: { name: 'The Mediator', desc: 'Creative, empathetic and guided by strong values.' },
  ENFJ: { name: 'The Protagonist', desc: 'Charismatic, warm and inspiring to others.' },
  ENFP: { name: 'The Campaigner', desc: 'Enthusiastic, creative and loves connecting with people.' },
  ISTJ: { name: 'The Logistician', desc: 'Reliable, practical and deeply committed.' },
  ISFJ: { name: 'The Defender', desc: 'Caring, loyal and always there for the people they love.' },
  ESTJ: { name: 'The Executive', desc: 'Organised, honest and dedicated to doing what is right.' },
  ESFJ: { name: 'The Consul', desc: 'Caring, social and loves bringing people together.' },
  ISTP: { name: 'The Virtuoso', desc: 'Observant, practical and masters of tools and craft.' },
  ISFP: { name: 'The Adventurer', desc: 'Gentle, sensitive and always open to new experiences.' },
  ESTP: { name: 'The Entrepreneur', desc: 'Energetic, perceptive and loves living on the edge.' },
  ESFP: { name: 'The Entertainer', desc: 'Spontaneous, energetic and loves being the life of the party.' },
}

function calculateMBTI(answers) {
  const e = answers.EI === 'E' ? 1 : 0
  const s = answers.SN === 'S' ? 1 : 0
  const tScore = (answers.TF === 'T' ? 1 : 0) + (answers.TIE === 'T' ? 1 : 0)
  const j = answers.JP === 'J' ? 1 : 0

  const ei = e >= 1 ? 'E' : 'I'
  const sn = s >= 1 ? 'S' : 'N'
  const tf = tScore >= 1 ? 'T' : 'F'
  const jp = j >= 1 ? 'J' : 'P'

  return `${ei}${sn}${tf}${jp}`
}

export default function Step8Personality({ navigation, route }) {
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [currentQ, setCurrentQ] = useState(0)

  function handleAnswer(questionId, value) {
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)

    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 300)
    } else {
      const mbti = calculateMBTI(newAnswers)
      setTimeout(() => setResult(mbti), 300)
    }
  }

  function handleComplete() {
    navigation.navigate('MainApp', {
      ...route.params,
      mbtiType: result,
      mbtiName: MBTI_TYPES[result]?.name,
    })
  }

  const question = QUESTIONS[currentQ]
  const mbtiInfo = result ? MBTI_TYPES[result] : null

  if (result) {
    return (
      <OnboardingLayout
        step={8}
        totalSteps={8}
        title="Your personality"
        subtitle="Based on your answers we think you are..."
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.resultCard}>
            <Text style={styles.resultType}>{result}</Text>
            <Text style={styles.resultName}>{mbtiInfo?.name}</Text>
            <View style={styles.resultDivider} />
            <Text style={styles.resultDesc}>{mbtiInfo?.desc}</Text>
          </View>

          <View style={styles.dimensionsRow}>
            {result.split('').map((letter, i) => {
              const labels = {
                E: 'Extrovert', I: 'Introvert',
                S: 'Sensing', N: 'Intuitive',
                T: 'Thinking', F: 'Feeling',
                J: 'Judging', P: 'Perceiving',
              }
              return (
                <View key={i} style={styles.dimensionBadge}>
                  <Text style={styles.dimensionLetter}>{letter}</Text>
                  <Text style={styles.dimensionLabel}>{labels[letter]}</Text>
                </View>
              )
            })}
          </View>

          <View style={styles.matchHint}>
            <Text style={styles.matchHintTitle}>✦ How Neli uses this</Text>
            <Text style={styles.matchHintText}>
              We'll show you people whose personality complements yours — whether that's someone similar or a perfect opposite. You can always update this in your profile settings.
            </Text>
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleComplete}>
            <Text style={styles.btnText}>Enter Neli</Text>
          </TouchableOpacity>
        </ScrollView>
      </OnboardingLayout>
    )
  }

  return (
    <OnboardingLayout
      step={8}
      totalSteps={8}
      title="Quick personality quiz"
      subtitle={`Question ${currentQ + 1} of ${QUESTIONS.length}`}
      onBack={currentQ > 0 ? () => setCurrentQ(currentQ - 1) : () => navigation.goBack()}
    >
      <View style={styles.questionContainer}>
        <Text style={styles.questionEmoji}>{question.emoji}</Text>
        <Text style={styles.questionText}>{question.question}</Text>

        <View style={styles.progressDots}>
          {QUESTIONS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentQ && styles.dotActive,
                i < currentQ && styles.dotDone,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.answerBtn,
            answers[question.id] === question.optionA.value && styles.answerBtnSelected,
          ]}
          onPress={() => handleAnswer(question.id, question.optionA.value)}
        >
          <Text style={[
            styles.answerText,
            answers[question.id] === question.optionA.value && styles.answerTextSelected,
          ]}>
            {question.optionA.label}
          </Text>
        </TouchableOpacity>

        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.orLine} />
        </View>

        <TouchableOpacity
          style={[
            styles.answerBtn,
            answers[question.id] === question.optionB.value && styles.answerBtnSelected,
          ]}
          onPress={() => handleAnswer(question.id, question.optionB.value)}
        >
          <Text style={[
            styles.answerText,
            answers[question.id] === question.optionB.value && styles.answerTextSelected,
          ]}>
            {question.optionB.label}
          </Text>
        </TouchableOpacity>
      </View>
    </OnboardingLayout>
  )
}

const styles = StyleSheet.create({
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: spacing.xl,
  },
  questionEmoji: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  questionText: {
    fontSize: 18,
    color: colors.parch,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: spacing.lg,
    fontWeight: '400',
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.line,
  },
  dotActive: {
    backgroundColor: colors.champagne,
    width: 18,
  },
  dotDone: {
    backgroundColor: colors.gold,
  },
  answerBtn: {
    backgroundColor: colors.obsidian2,
    borderWidth: 0.5,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  answerBtnSelected: {
    backgroundColor: 'rgba(232,213,163,0.12)',
    borderColor: colors.champagne,
  },
  answerText: {
    fontSize: 15,
    color: colors.taupeLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  answerTextSelected: {
    color: colors.champagne,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  orLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: colors.line,
  },
  orText: {
    fontSize: 12,
    color: colors.taupeLight,
    opacity: 0.5,
  },
  resultCard: {
    backgroundColor: colors.obsidian2,
    borderWidth: 0.5,
    borderColor: colors.champagne,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  resultType: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 56,
    color: colors.champagne,
    letterSpacing: 4,
  },
  resultName: {
    fontSize: 16,
    color: colors.parch,
    marginTop: spacing.xs,
    letterSpacing: 1,
  },
  resultDivider: {
    width: 40,
    height: 0.5,
    backgroundColor: colors.champagne,
    opacity: 0.4,
    marginVertical: spacing.md,
  },
  resultDesc: {
    fontSize: 14,
    color: colors.taupeLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  dimensionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    flexWrap: 'wrap',
  },
  dimensionBadge: {
    flex: 1,
    backgroundColor: colors.obsidian2,
    borderWidth: 0.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    minWidth: '22%',
  },
  dimensionLetter: {
    fontSize: 20,
    color: colors.gold,
    fontWeight: '500',
  },
  dimensionLabel: {
    fontSize: 9,
    color: colors.taupeLight,
    marginTop: 2,
    textAlign: 'center',
  },
  matchHint: {
    backgroundColor: 'rgba(232,213,163,0.05)',
    borderWidth: 0.5,
    borderColor: colors.lineBright,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  matchHintTitle: {
    fontSize: 13,
    color: colors.champagne,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  matchHintText: {
    fontSize: 12,
    color: colors.taupeLight,
    lineHeight: 18,
  },
  btn: {
    backgroundColor: colors.champagne,
    padding: spacing.md,
    borderRadius: radius.full,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  btnText: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 18,
    color: colors.obsidian,
  },
})