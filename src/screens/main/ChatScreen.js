import { useState, useEffect, useRef } from 'react'
import {
  View, Text, TouchableOpacity,
  StyleSheet, FlatList, TextInput,
  ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native'
import { colors, radius, spacing } from '../../constants/theme'
import { DiagonalWeave } from '../../components/OnboardingLayout'
import { supabase } from '../../../lib/supabase'

export default function ChatScreen({ navigation, route }) {
  const { match, profile } = route.params || {}
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const flatListRef = useRef(null)

  useEffect(() => {
    setupChat()
    return () => {
      supabase.channel('messages').unsubscribe()
    }
  }, [])

  async function setupChat() {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
    await fetchMessages(user.id)
    subscribeToMessages(user.id)
    setLoading(false)
  }

  async function fetchMessages(userId) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', match.id)
        .order('created_at', { ascending: true })
      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.log('Error fetching messages:', error)
    }
  }

  function subscribeToMessages(userId) {
    supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${match.id}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new])
        flatListRef.current?.scrollToEnd({ animated: true })
      })
      .subscribe()
  }

  async function sendMessage() {
    if (!newMessage.trim() || sending) return
    setSending(true)
    const content = newMessage.trim()
    setNewMessage('')

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          match_id: match.id,
          sender_id: currentUser.id,
          content,
        })
      if (error) throw error
      flatListRef.current?.scrollToEnd({ animated: true })
    } catch (error) {
      console.log('Error sending message:', error)
      setNewMessage(content)
    } finally {
      setSending(false)
    }
  }

  function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const renderMessage = ({ item, index }) => {
    const isMe = item.sender_id === currentUser?.id
    const showTime = index === 0 ||
      new Date(item.created_at) - new Date(messages[index - 1]?.created_at) > 300000

    return (
      <View>
        {showTime && (
          <Text style={styles.timeLabel}>{formatTime(item.created_at)}</Text>
        )}
        <View style={[styles.messageRow, isMe && styles.messageRowMe]}>
          <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
            <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>
              {item.content}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <DiagonalWeave />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={[styles.headerAvatar, { backgroundColor: profile?.cardColor || '#252535' }]}>
          <Text style={styles.headerAvatarText}>
            {profile?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{profile?.full_name?.split(' ')[0]}</Text>
          <Text style={styles.headerStatus}>Active now · {profile?.country_flag}</Text>
        </View>
      </View>

      {/* Safety banner */}
      <View style={styles.safetyBanner}>
        <Text style={styles.safetyText}>
          🛡 Always meet in a public place first. Trust your instincts.
        </Text>
      </View>

      {/* Prompt answers */}
      {match?.user1_answer && match?.user2_answer && (
        <View style={styles.promptIntro}>
          <Text style={styles.promptIntroLabel}>Neli started your conversation</Text>
          <Text style={styles.promptIntroQ} numberOfLines={2}>"{match.neli_prompt}"</Text>
          <View style={styles.answersRow}>
            <View style={styles.answerBubble}>
              <Text style={styles.answerWho}>You answered</Text>
              <Text style={styles.answerText}>
                {match.user1_id === currentUser?.id ? match.user1_answer : match.user2_answer}
              </Text>
            </View>
            <View style={[styles.answerBubble, styles.answerBubbleGold]}>
              <Text style={styles.answerWho}>{profile?.full_name?.split(' ')[0]} answered</Text>
              <Text style={styles.answerText}>
                {match.user1_id === currentUser?.id ? match.user2_answer : match.user1_answer}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Messages */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.champagne} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          renderItem={renderMessage}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={
            <View style={styles.emptyMessages}>
              <Text style={styles.emptyMessagesText}>
                Your chat is unlocked! Say hello to {profile?.full_name?.split(' ')[0]} 👋
              </Text>
            </View>
          }
        />
      )}

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder={`Message ${profile?.full_name?.split(' ')[0]}...`}
          placeholderTextColor={colors.taupeLight}
          multiline
          maxLength={500}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!newMessage.trim() || sending) && styles.sendBtnDisabled]}
          onPress={sendMessage}
          disabled={!newMessage.trim() || sending}
        >
          {sending
            ? <ActivityIndicator color={colors.obsidian} size="small" />
            : <Text style={styles.sendBtnText}>↑</Text>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.obsidian,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: 52,
    paddingBottom: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.line,
    gap: spacing.sm,
    zIndex: 1,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    color: colors.champagne,
    fontSize: 20,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.champagne,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {
    color: colors.champagne,
    fontSize: 13,
    fontWeight: '500',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 18,
    color: colors.parch,
  },
  headerStatus: {
    fontSize: 11,
    color: colors.taupeLight,
    opacity: 0.7,
  },
  safetyBanner: {
    backgroundColor: 'rgba(42,107,74,0.1)',
    borderBottomWidth: 0.5,
    borderBottomColor: '#2A6B4A',
    padding: spacing.sm,
    zIndex: 1,
  },
  safetyText: {
    fontSize: 11,
    color: '#5ecb96',
    textAlign: 'center',
  },
  promptIntro: {
    backgroundColor: 'rgba(232,213,163,0.05)',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.line,
    padding: spacing.md,
    zIndex: 1,
  },
  promptIntroLabel: {
    fontSize: 10,
    color: colors.champagne,
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  promptIntroQ: {
    fontSize: 12,
    color: colors.taupeLight,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  answersRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  answerBubble: {
    flex: 1,
    backgroundColor: colors.obsidian2,
    borderRadius: radius.sm,
    borderWidth: 0.5,
    borderColor: colors.line,
    padding: spacing.sm,
  },
  answerBubbleGold: {
    borderColor: colors.champagne,
    backgroundColor: 'rgba(232,213,163,0.05)',
  },
  answerWho: {
    fontSize: 9,
    color: colors.champagne,
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  answerText: {
    fontSize: 11,
    color: colors.parch,
    lineHeight: 15,
    fontFamily: 'Italiana_400Regular',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesList: {
    flex: 1,
    zIndex: 1,
  },
  messagesContent: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  timeLabel: {
    textAlign: 'center',
    fontSize: 10,
    color: colors.taupeLight,
    opacity: 0.5,
    marginVertical: spacing.sm,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '75%',
    padding: spacing.sm,
    borderRadius: radius.lg,
    borderBottomLeftRadius: 4,
    backgroundColor: colors.obsidian2,
    borderWidth: 0.5,
    borderColor: colors.line,
  },
  bubbleMe: {
    backgroundColor: colors.champagne,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: 4,
    borderColor: colors.champagne,
  },
  bubbleText: {
    fontSize: 14,
    color: colors.parch,
    lineHeight: 20,
  },
  bubbleTextMe: {
    color: colors.obsidian,
  },
  emptyMessages: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  emptyMessagesText: {
    fontSize: 14,
    color: colors.taupeLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 0.5,
    borderTopColor: colors.line,
    backgroundColor: colors.obsidian,
    zIndex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: colors.obsidian2,
    borderWidth: 0.5,
    borderColor: colors.line,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.parch,
    fontSize: 14,
    maxHeight: 100,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.champagne,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  sendBtnText: {
    color: colors.obsidian,
    fontSize: 18,
    fontWeight: '600',
  },
})