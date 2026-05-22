import { useState, useEffect } from 'react'
import {
  View, Text, TouchableOpacity,
  StyleSheet, FlatList, ActivityIndicator
} from 'react-native'
import { colors, radius, spacing } from '../../constants/theme'
import { DiagonalWeave } from '../../components/OnboardingLayout'
import { supabase } from '../../../lib/supabase'

function MatchCard({ match, onPress }) {
  const other = match.other_profile
  const isUnlocked = match.chat_unlocked
  const bothAnswered = match.user1_answered && match.user2_answered

  return (
    <TouchableOpacity style={styles.matchCard} onPress={onPress}>
      <View style={[styles.matchAvatar, { backgroundColor: other?.cardColor || '#252535' }]}>
        <Text style={styles.matchAvatarText}>
          {other?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
        </Text>
        {isUnlocked && <View style={styles.unlockedDot} />}
      </View>
      <View style={styles.matchInfo}>
        <View style={styles.matchNameRow}>
          <Text style={styles.matchName}>{other?.full_name?.split(' ')[0]}</Text>
          <Text style={styles.matchFlag}>{other?.country_flag}</Text>
          {other?.mbti_type && (
            <View style={styles.mbtiBadge}>
              <Text style={styles.mbtiText}>✦ {other?.mbti_type}</Text>
            </View>
          )}
        </View>
        <Text style={styles.matchStatus}>
          {isUnlocked
            ? '💬 Chat unlocked — say hello!'
            : bothAnswered
              ? '🔓 Both answered — unlocking chat...'
              : match.user1_answered || match.user2_answered
                ? '⏳ Waiting for the other person to answer'
                : '✦ Answer the prompt to unlock chat'
          }
        </Text>
        {match.neli_prompt && !isUnlocked && (
          <Text style={styles.matchPrompt} numberOfLines={1}>
            "{match.neli_prompt}"
          </Text>
        )}
      </View>
      <Text style={styles.matchArrow}>›</Text>
    </TouchableOpacity>
  )
}

export default function MatchesScreen({ navigation }) {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMatches()
  }, [])

  async function fetchMatches() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          user1:profiles!matches_user1_id_fkey(id, full_name, country_flag, nationality, mbti_type),
          user2:profiles!matches_user2_id_fkey(id, full_name, country_flag, nationality, mbti_type)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formatted = data.map(match => ({
        ...match,
        other_profile: match.user1_id === user.id ? match.user2 : match.user1,
        my_answered: match.user1_id === user.id ? match.user1_answered : match.user2_answered,
      }))

      setMatches(formatted)
    } catch (error) {
      console.log('Error fetching matches:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.wrapper}>
      <DiagonalWeave />

      <View style={styles.topNav}>
        <Text style={styles.logo}>Neli</Text>
        <Text style={styles.navTitle}>Your matches</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.champagne} />
        </View>
      ) : matches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>♡</Text>
          <Text style={styles.emptyTitle}>No matches yet</Text>
          <Text style={styles.emptyText}>
            When you and someone like each other, they'll appear here
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate('Browse')}
          >
            <Text style={styles.browseBtnText}>Browse profiles</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={item => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <MatchCard
              match={item}
              onPress={() => {
                if (item.chat_unlocked) {
                  navigation.navigate('ChatScreen', {
                    match: item,
                    profile: item.other_profile,
                  })
                } else {
                  navigation.navigate('MatchScreen', {
                    profile: item.other_profile,
                    prompt: item.neli_prompt,
                    matchId: item.id,
                  })
                }
              }}
            />
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.obsidian,
  },
  topNav: {
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
    paddingBottom: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.line,
    zIndex: 1,
  },
  logo: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 28,
    color: colors.champagne,
  },
  navTitle: {
    fontSize: 13,
    color: colors.taupeLight,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    zIndex: 1,
  },
  emptyIcon: {
    fontSize: 48,
    color: colors.champagne,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 28,
    color: colors.parch,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: colors.taupeLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  browseBtn: {
    backgroundColor: colors.champagne,
    padding: spacing.md,
    borderRadius: radius.full,
    paddingHorizontal: spacing.xl,
  },
  browseBtnText: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 16,
    color: colors.obsidian,
  },
  list: {
    flex: 1,
    zIndex: 1,
  },
  listContent: {
    padding: spacing.md,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.obsidian2,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.line,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  matchAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: colors.champagne,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexShrink: 0,
  },
  matchAvatarText: {
    color: colors.champagne,
    fontSize: 16,
    fontWeight: '500',
  },
  unlockedDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2A6B4A',
    borderWidth: 2,
    borderColor: colors.obsidian2,
  },
  matchInfo: {
    flex: 1,
  },
  matchNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  matchName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.parch,
  },
  matchFlag: {
    fontSize: 14,
  },
  mbtiBadge: {
    backgroundColor: 'rgba(232,213,163,0.08)',
    borderWidth: 0.5,
    borderColor: colors.champagne,
    borderRadius: radius.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  mbtiText: {
    fontSize: 9,
    color: colors.champagne,
  },
  matchStatus: {
    fontSize: 12,
    color: colors.taupeLight,
    marginBottom: 4,
  },
  matchPrompt: {
    fontSize: 11,
    color: colors.taupeLight,
    opacity: 0.5,
    fontStyle: 'italic',
  },
  matchArrow: {
    fontSize: 20,
    color: colors.taupeLight,
    opacity: 0.4,
  },
})