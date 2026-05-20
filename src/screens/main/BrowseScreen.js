import { useState, useEffect } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, TextInput, ActivityIndicator
} from 'react-native'
import { DiagonalWeave } from '../../components/OnboardingLayout'
import { colors, spacing, radius } from '../../constants/theme'
import { supabase } from '../../../lib/supabase'

const FILTERS = ['All', 'Near me', 'New', 'Online']

function ProfileCard({ profile, onPress }) {
  const prompt = profile.profile_prompts?.[0]

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.cardPhoto, { backgroundColor: profile.cardColor || '#1a1a1a' }]}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {profile.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </Text>
        </View>
        {profile.is_verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓</Text>
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        {prompt && (
          <>
            <Text style={styles.cardPrompt} numberOfLines={1}>
              {prompt.prompt_question}
            </Text>
            <Text style={styles.cardAnswer} numberOfLines={3}>
              "{prompt.prompt_answer}"
            </Text>
          </>
        )}
        <View style={styles.cardMeta}>
          <Text style={styles.cardName}>
            {profile.full_name?.split(' ')[0]}, {calculateAge(profile.date_of_birth)}
          </Text>
          <Text style={styles.cardFlag}>{profile.country_flag}</Text>
        </View>
        {profile.mbti_type && (
          <View style={styles.mbtiBadge}>
            <Text style={styles.mbtiText}>✦ {profile.mbti_type}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

function calculateAge(dob) {
  if (!dob) return ''
  const parts = dob.split('/')
  if (parts.length !== 3) return ''
  const birthYear = parseInt(parts[2])
  return new Date().getFullYear() - birthYear
}

// Sample profiles for testing UI before real data
const SAMPLE_PROFILES = [
  {
    id: '1',
    full_name: 'Amara Osei',
    date_of_birth: '15/03/1998',
    country_flag: '🇳🇬',
    is_verified: true,
    mbti_type: 'INFJ',
    cardColor: '#3a2525',
    profile_prompts: [{
      prompt_question: "I'd love to learn about...",
      prompt_answer: "Japanese tea ceremonies — the mindfulness of it captivates me",
    }],
  },
  {
    id: '2',
    full_name: 'Lena Kapoor',
    date_of_birth: '22/07/1996',
    country_flag: '🇮🇳',
    is_verified: true,
    mbti_type: 'ENFP',
    cardColor: '#252535',
    profile_prompts: [{
      prompt_question: "My culture's best tradition...",
      prompt_answer: "Diwali with the whole family, every single year without fail",
    }],
  },
  {
    id: '3',
    full_name: 'Zara Mansour',
    date_of_birth: '08/11/1999',
    country_flag: '🇲🇦',
    is_verified: false,
    mbti_type: 'ISTP',
    cardColor: '#253525',
    profile_prompts: [{
      prompt_question: "My perfect date involves...",
      prompt_answer: "Cooking a meal from two different cultures together",
    }],
  },
  {
    id: '4',
    full_name: 'Jules Bernard',
    date_of_birth: '30/01/1994',
    country_flag: '🇫🇷',
    is_verified: true,
    mbti_type: 'ENTP',
    cardColor: '#352535',
    profile_prompts: [{
      prompt_question: "Teach me...",
      prompt_answer: "How to speak even a little Zulu — it sounds so beautiful",
    }],
  },
  {
    id: '5',
    full_name: 'Keiko Tanaka',
    date_of_birth: '14/06/1997',
    country_flag: '🇯🇵',
    is_verified: true,
    mbti_type: 'ISFJ',
    cardColor: '#353525',
    profile_prompts: [{
      prompt_question: "I feel most at home when...",
      prompt_answer: "Sharing a meal with people from completely different backgrounds",
    }],
  },
  {
    id: '6',
    full_name: 'Marcus Silva',
    date_of_birth: '03/09/1995',
    country_flag: '🇧🇷',
    is_verified: false,
    mbti_type: 'ESFP',
    cardColor: '#2a2535',
    profile_prompts: [{
      prompt_question: "The culture I'd love to experience...",
      prompt_answer: "Ethiopian coffee ceremonies — the ritual and community of it",
    }],
  },
]

export default function BrowseScreen({ navigation }) {
  const [filter, setFilter] = useState('All')
  const [profiles, setProfiles] = useState(SAMPLE_PROFILES)
  const [loading, setLoading] = useState(false)

  return (
    <View style={styles.container}>
      <DiagonalWeave />

      {/* Top nav */}
      <View style={styles.topNav}>
        <Text style={styles.logo}>Neli</Text>
        <View style={styles.navRight}>
          <TouchableOpacity style={styles.navBtn}>
            <Text style={styles.navIcon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn}>
            <Text style={styles.navIcon}>⚙</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterPill, filter === f && styles.filterPillActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.champagne} />
        </View>
      ) : (
        <ScrollView
          style={styles.grid}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.gridRow}>
            {profiles.map((profile, index) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onPress={() => navigation.navigate('ProfileDetail', { profile })}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.obsidian,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
    paddingBottom: spacing.sm,
    zIndex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.line,
  },
  logo: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 28,
    color: colors.champagne,
  },
  navRight: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.obsidian2,
    borderWidth: 0.5,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 16,
  },
  filterRow: {
    zIndex: 1,
    maxHeight: 48,
  },
  filterContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    flexDirection: 'row',
  },
  filterPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 0.5,
    borderColor: colors.line,
    backgroundColor: colors.obsidian2,
  },
  filterPillActive: {
    backgroundColor: colors.champagne,
    borderColor: colors.champagne,
  },
  filterText: {
    fontSize: 12,
    color: colors.taupeLight,
  },
  filterTextActive: {
    color: colors.obsidian,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flex: 1,
    zIndex: 1,
  },
  gridContent: {
    padding: spacing.sm,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  card: {
    width: '48%',
    backgroundColor: colors.obsidian2,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  cardPhoto: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(232,213,163,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.champagne,
    fontSize: 16,
    fontWeight: '500',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2A6B4A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  cardBody: {
    padding: spacing.sm,
  },
  cardPrompt: {
    fontSize: 9,
    color: colors.gold,
    fontWeight: '500',
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  cardAnswer: {
    fontSize: 11,
    color: colors.parch,
    lineHeight: 15,
    opacity: 0.85,
    marginBottom: spacing.sm,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: 0.5,
    borderTopColor: colors.line,
  },
  cardName: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.parch,
  },
  cardFlag: {
    fontSize: 14,
  },
  mbtiBadge: {
    marginTop: 4,
  },
  mbtiText: {
    fontSize: 9,
    color: colors.taupeLight,
    opacity: 0.6,
  },
})