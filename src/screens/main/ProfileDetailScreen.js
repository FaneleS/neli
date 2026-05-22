import { useState } from 'react'
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { colors, radius, spacing } from '../../constants/theme'
import { DiagonalWeave } from '../../components/OnboardingLayout'
import { supabase } from '../../../lib/supabase'

export default function ProfileDetailScreen({ navigation, route }) {
  const { profile } = route.params || {}
  const [loading, setLoading] = useState(false)

  async function handleSwipe(direction) {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('swipes')
        .upsert({
          swiper_id: user.id,
          swiped_id: profile.id,
          direction,
        })
      if (error) throw error

      if (direction === 'like') {
        const { data: mutualLike } = await supabase
          .from('swipes')
          .select('*')
          .eq('swiper_id', profile.id)
          .eq('swiped_id', user.id)
          .eq('direction', 'like')
          .single()

        if (mutualLike) {
          const { error: matchError } = await supabase
            .from('matches')
            .upsert({
              user1_id: user.id,
              user2_id: profile.id,
              neli_prompt: getRandomPrompt(),
              chat_unlocked: false,
            })
          if (!matchError) {
            setLoading(false)
            navigation.navigate('MatchScreen', { profile })
            return
          }
        }
      }
      setLoading(false)
      navigation.goBack()
    } catch (error) {
      setLoading(false)
      navigation.goBack()
    }
  }

  function getRandomPrompt() {
    const prompts = [
      "What's one tradition from your culture you'd love to share with someone special?",
      "What's the most beautiful thing about where you come from?",
      "If you could take someone on a cultural adventure, where would you go first?",
      "What's a meal from your culture that tells your story?",
      "What's one thing you wish more people knew about your background?",
    ]
    return prompts[Math.floor(Math.random() * prompts.length)]
  }

  if (!profile) {
    navigation.goBack()
    return null
  }

  return (
    <View style={styles.wrapper}>
      <DiagonalWeave />

      <View style={styles.photoArea}>
        <View style={[styles.photoPlaceholder, { backgroundColor: profile.cardColor || '#1a1a1a' }]}>
          <Text style={styles.avatarText}>
            {profile.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </Text>
        </View>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={18} color={colors.champagne} />
        </TouchableOpacity>

        {profile.is_verified && (
          <View style={styles.verifiedBadge}>
            <Feather name="check-circle" size={11} color="#5ecb96" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}

        <View style={styles.swipeHints}>
          <View style={styles.hintItem}>
            <View style={styles.hintCirclePass}>
              <Feather name="arrow-down" size={14} color={colors.taupeLight} />
            </View>
            <Text style={styles.hintLabel}>Pass</Text>
          </View>
          <View style={styles.hintItem}>
            <View style={styles.hintCircleLike}>
              <Feather name="arrow-up" size={14} color={colors.champagne} />
            </View>
            <Text style={[styles.hintLabel, { color: colors.champagne }]}>Like</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.nameRow}>
          <Text style={styles.name}>{profile.full_name?.split(' ')[0]}</Text>
          <Text style={styles.age}>{calculateAge(profile.date_of_birth)}</Text>
          <Text style={styles.flag}>{profile.country_flag}</Text>
          {profile.mbti_type && (
            <View style={styles.mbtiBadge}>
              <Text style={styles.mbtiText}>✦ {profile.mbti_type}</Text>
            </View>
          )}
        </View>

        <Text style={styles.location}>
          <Feather name="map-pin" size={11} color={colors.taupeLight} /> {profile.nationality || 'Earth'}
        </Text>

        <View style={styles.openBadge}>
          <Feather name="check-circle" size={11} color="#5ecb96" />
          <Text style={styles.openBadgeText}>Open to all backgrounds</Text>
        </View>

        {profile.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>About</Text>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </View>
        )}

        {profile.profile_prompts?.map((prompt, i) => (
          <View key={i} style={styles.promptBlock}>
            <Text style={styles.promptQ}>{prompt.prompt_question}</Text>
            <Text style={styles.promptA}>"{prompt.prompt_answer}"</Text>
          </View>
        ))}

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.passBtn}
            onPress={() => handleSwipe('pass')}
            disabled={loading}
          >
            <Feather name="x" size={16} color={colors.taupeLight} />
            <Text style={styles.passBtnText}>Pass</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.likeBtn}
            onPress={() => handleSwipe('like')}
            disabled={loading}
          >
            <Feather name="heart" size={16} color={colors.obsidian} />
            <Text style={styles.likeBtnText}>Like</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.safetyBar}>
          <Feather name="shield" size={13} color="#5ecb96" />
          <Text style={styles.safetyText}>
            Always meet in a public place first. Trust your instincts.
          </Text>
        </View>

      </ScrollView>
    </View>
  )
}

function calculateAge(dob) {
  if (!dob) return ''
  const parts = dob.split('/')
  if (parts.length !== 3) return ''
  const birthYear = parseInt(parts[2])
  return new Date().getFullYear() - birthYear
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.obsidian,
  },
  photoArea: {
    height: 280,
    position: 'relative',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.line,
  },
  photoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 64,
    fontWeight: '300',
    color: 'rgba(232,213,163,0.4)',
    fontFamily: 'Italiana_400Regular',
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: spacing.lg,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(8,8,8,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: colors.line,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 52,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(42,107,74,0.3)',
    borderWidth: 0.5,
    borderColor: '#2A6B4A',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  verifiedText: {
    fontSize: 11,
    color: '#5ecb96',
  },
  swipeHints: {
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  hintItem: {
    alignItems: 'center',
    gap: 4,
  },
  hintCirclePass: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: colors.line,
    backgroundColor: 'rgba(107,80,64,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintCircleLike: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: colors.champagne,
    backgroundColor: 'rgba(232,213,163,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintLabel: {
    fontSize: 10,
    color: colors.taupeLight,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  name: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 28,
    color: colors.parch,
  },
  age: {
    fontSize: 18,
    color: colors.taupeLight,
  },
  flag: {
    fontSize: 20,
  },
  mbtiBadge: {
    backgroundColor: 'rgba(232,213,163,0.08)',
    borderWidth: 0.5,
    borderColor: colors.champagne,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  mbtiText: {
    fontSize: 11,
    color: colors.champagne,
  },
  location: {
    fontSize: 12,
    color: colors.taupeLight,
    marginBottom: spacing.sm,
  },
  openBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(42,107,74,0.15)',
    borderWidth: 0.5,
    borderColor: '#2A6B4A',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginBottom: spacing.lg,
  },
  openBadgeText: {
    fontSize: 11,
    color: '#5ecb96',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: 10,
    color: colors.champagne,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  bioText: {
    fontSize: 14,
    color: colors.parch,
    lineHeight: 22,
    opacity: 0.85,
  },
  promptBlock: {
    backgroundColor: colors.obsidian2,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.line,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  promptQ: {
    fontSize: 10,
    color: colors.champagne,
    fontWeight: '500',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  promptA: {
    fontSize: 14,
    color: colors.parch,
    lineHeight: 20,
    fontFamily: 'Italiana_400Regular',
    opacity: 0.9,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  passBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.full,
    borderWidth: 0.5,
    borderColor: colors.line,
    backgroundColor: colors.obsidian2,
  },
  passBtnText: {
    fontSize: 15,
    color: colors.taupeLight,
  },
  likeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.champagne,
  },
  likeBtnText: {
    fontSize: 15,
    color: colors.obsidian,
    fontWeight: '500',
  },
  safetyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(42,107,74,0.1)',
    borderWidth: 0.5,
    borderColor: '#2A6B4A',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  safetyText: {
    flex: 1,
    fontSize: 11,
    color: '#5ecb96',
    lineHeight: 16,
  },
})