import { useState } from 'react'
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, TextInput, Alert
} from 'react-native'
import { colors, radius, spacing } from '../../constants/theme'
import { DiagonalWeave } from '../../components/OnboardingLayout'
import { supabase } from '../../../lib/supabase'

export default function MatchScreen({ navigation, route }) {
  const { profile } = route.params || {}
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmitAnswer() {
    if (answer.trim().length < 5) {
      return Alert.alert('Please write a longer answer')
    }
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      const { data: match } = await supabase
        .from('matches')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .single()

      if (match) {
        const isUser1 = match.user1_id === user.id
        const updateData = isUser1
          ? { user1_answer: answer.trim(), user1_answered: true }
          : { user2_answer: answer.trim(), user2_answered: true }

        const bothAnswered = isUser1 ? match.user2_answered : match.user1_answered
        if (bothAnswered) updateData.chat_unlocked = true

        await supabase.from('matches').update(updateData).eq('id', match.id)
      }

      setLoading(false)
      setSubmitted(true)
    } catch (error) {
      setLoading(false)
      Alert.alert('Error', error.message)
    }
  }

  if (submitted) {
    return (
      <View style={styles.wrapper}>
        <DiagonalWeave />
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <View style={styles.center}>
            <Text style={styles.logo}>Neli</Text>
            <Text style={styles.matchTitle}>Answer sent! ✦</Text>
            <Text style={styles.matchSub}>
              We'll notify you when {profile?.full_name?.split(' ')[0]} answers too.
              Once both of you answer, your chat will unlock!
            </Text>
            <View style={styles.waitingCard}>
              <Text style={styles.waitingIcon}>⏳</Text>
              <Text style={styles.waitingText}>
                Waiting for {profile?.full_name?.split(' ')[0]} to answer...
              </Text>
            </View>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Browse')}>
              <Text style={styles.btnText}>Keep browsing</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    )
  }

  return (
    <View style={styles.wrapper}>
      <DiagonalWeave />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.center}>
          <Text style={styles.logo}>Neli</Text>
          <Text style={styles.matchTitle}>It's a match! 🎉</Text>
          <Text style={styles.matchSub}>
            You and {profile?.full_name?.split(' ')[0]} liked each other.
            Answer the same question to unlock your chat.
          </Text>

          <View style={styles.avatarsRow}>
            <View style={[styles.avatar, { backgroundColor: '#252535' }]}>
              <Text style={styles.avatarText}>You</Text>
            </View>
            <View style={styles.heartCircle}>
              <Text style={styles.heartText}>♡</Text>
            </View>
            <View style={[styles.avatar, { backgroundColor: profile?.cardColor || '#3a2525' }]}>
              <Text style={styles.avatarText}>
                {profile?.full_name?.split(' ')[0]?.slice(0, 2).toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.promptCard}>
            <Text style={styles.promptFrom}>Neli asks you both...</Text>
            <Text style={styles.promptQ}>
              "{route.params?.prompt || "What's one tradition from your culture you'd love to share with someone special?"}"
            </Text>
            <TextInput
              style={styles.answerInput}
              value={answer}
              onChangeText={setAnswer}
              placeholder="Your answer..."
              placeholderTextColor={colors.taupeLight}
              multiline
              maxLength={200}
            />
            <Text style={styles.answerHint}>
              {profile?.full_name?.split(' ')[0]} won't see your answer until they reply too
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.btn, (answer.trim().length < 5 || loading) && styles.btnDisabled]}
            onPress={handleSubmitAnswer}
            disabled={answer.trim().length < 5 || loading}
          >
            <Text style={styles.btnText}>Send my answer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => navigation.navigate('Browse')}
          >
            <Text style={styles.skipText}>Remind me later</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: colors.obsidian },
  scroll: { flex: 1, zIndex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, paddingTop: 60 },
  center: { alignItems: 'center' },
  logo: { fontFamily: 'Italiana_400Regular', fontSize: 32, color: colors.champagne, marginBottom: spacing.sm },
  matchTitle: { fontFamily: 'Italiana_400Regular', fontSize: 36, color: colors.parch, marginBottom: spacing.sm, textAlign: 'center' },
  matchSub: { fontSize: 14, color: colors.taupeLight, textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl },
  avatarsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xl },
  avatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, borderColor: colors.champagne, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.champagne, fontSize: 16, fontWeight: '500' },
  heartCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.champagne, alignItems: 'center', justifyContent: 'center', marginHorizontal: -8, zIndex: 1 },
  heartText: { fontSize: 16, color: colors.obsidian },
  promptCard: { width: '100%', backgroundColor: colors.obsidian2, borderRadius: radius.lg, borderWidth: 0.5, borderColor: colors.champagne, padding: spacing.lg, marginBottom: spacing.lg },
  promptFrom: { fontSize: 10, color: colors.champagne, letterSpacing: 1, marginBottom: spacing.sm, textTransform: 'uppercase' },
  promptQ: { fontFamily: 'Italiana_400Regular', fontSize: 18, color: colors.parch, lineHeight: 26, marginBottom: spacing.md },
  answerInput: { backgroundColor: colors.obsidian, borderWidth: 0.5, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md, color: colors.parch, fontSize: 14, minHeight: 80, marginBottom: spacing.sm, lineHeight: 20 },
  answerHint: { fontSize: 11, color: colors.taupeLight, textAlign: 'center', opacity: 0.6 },
  waitingCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.obsidian2, borderWidth: 0.5, borderColor: colors.line, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.xl, width: '100%' },
  waitingIcon: { fontSize: 20 },
  waitingText: { fontSize: 13, color: colors.taupeLight, flex: 1 },
  btn: { width: '100%', backgroundColor: colors.champagne, padding: spacing.md, borderRadius: radius.full, alignItems: 'center', marginBottom: spacing.sm },
  btnDisabled: { opacity: 0.4 },
  btnText: { fontFamily: 'Italiana_400Regular', fontSize: 18, color: colors.obsidian },
  skipBtn: { padding: spacing.md, alignItems: 'center' },
  skipText: { fontSize: 12, color: colors.taupeLight, opacity: 0.6 },
})