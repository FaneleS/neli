import { useState, useEffect } from 'react'
import {
  View, Text, TouchableOpacity,
  StyleSheet, FlatList, ActivityIndicator
} from 'react-native'
import { colors, radius, spacing } from '../../constants/theme'
import { DiagonalWeave } from '../../components/OnboardingLayout'
import { supabase } from '../../../lib/supabase'

function ChatCard({ match, onPress }) {
  const other = match.other_profile
  const lastMsg = match.last_message

  return (
    <TouchableOpacity style={styles.chatCard} onPress={onPress}>
      <View style={[styles.chatAvatar, { backgroundColor: other?.cardColor || '#252535' }]}>
        <Text style={styles.chatAvatarText}>
          {other?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
        </Text>
        {match.unread && <View style={styles.unreadDot} />}
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatNameRow}>
          <Text style={styles.chatName}>{other?.full_name?.split(' ')[0]}</Text>
          <Text style={styles.chatFlag}>{other?.country_flag}</Text>
          {match.time && <Text style={styles.chatTime}>{match.time}</Text>}
        </View>
        <Text style={[styles.lastMsg, match.unread && styles.lastMsgUnread]} numberOfLines={1}>
          {lastMsg || 'Chat unlocked — say hello! 👋'}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default function ChatsScreen({ navigation }) {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChats()
  }, [])

  async function fetchChats() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          user1:profiles!matches_user1_id_fkey(id, full_name, country_flag, nationality),
          user2:profiles!matches_user2_id_fkey(id, full_name, country_flag, nationality),
          messages(content, created_at, sender_id)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq('chat_unlocked', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formatted = data.map(match => {
        const msgs = match.messages || []
        const lastMsg = msgs.sort((a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
        )[0]

        return {
          ...match,
          other_profile: match.user1_id === user.id ? match.user2 : match.user1,
          last_message: lastMsg?.content,
          unread: lastMsg && lastMsg.sender_id !== user.id,
          time: lastMsg ? formatTime(lastMsg.created_at) : null,
        }
      })

      setChats(formatted)
    } catch (error) {
      console.log('Error fetching chats:', error)
    } finally {
      setLoading(false)
    }
  }

  function formatTime(timestamp) {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    if (diff < 86400000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  return (
    <View style={styles.wrapper}>
      <DiagonalWeave />

      <View style={styles.topNav}>
        <Text style={styles.logo}>Neli</Text>
        <Text style={styles.navTitle}>Messages</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.champagne} />
        </View>
      ) : chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyTitle}>No chats yet</Text>
          <Text style={styles.emptyText}>
            When both you and a match answer the Neli prompt, your chat unlocks here
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
          data={chats}
          keyExtractor={item => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ChatCard
              match={item}
              onPress={() => navigation.navigate('ChatScreen', {
                match: item,
                profile: item.other_profile,
              })}
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
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.line,
    gap: spacing.md,
  },
  chatAvatar: {
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
  chatAvatarText: {
    color: colors.champagne,
    fontSize: 16,
    fontWeight: '500',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.champagne,
    borderWidth: 2,
    borderColor: colors.obsidian,
  },
  chatInfo: {
    flex: 1,
  },
  chatNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
  },
  chatName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.parch,
    flex: 1,
  },
  chatFlag: {
    fontSize: 14,
  },
  chatTime: {
    fontSize: 11,
    color: colors.taupeLight,
    opacity: 0.6,
  },
  lastMsg: {
    fontSize: 13,
    color: colors.taupeLight,
    opacity: 0.7,
  },
  lastMsgUnread: {
    color: colors.parch,
    opacity: 1,
    fontWeight: '500',
  },
})