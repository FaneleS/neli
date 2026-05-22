import { useState, useEffect } from 'react'
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, Alert, ActivityIndicator
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { colors, radius, spacing } from '../../constants/theme'
import { DiagonalWeave } from '../../components/OnboardingLayout'
import { supabase } from '../../../lib/supabase'

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('profiles')
        .select(`*, profile_prompts(*)`)
        .eq('id', user.id)
        .single()
      if (error && error.code !== 'PGRST116') throw error
      setProfile(data)
    } catch (error) {
      console.log('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    Alert.alert(
      'Sign out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut()
            navigation.reset({
              index: 0,
              routes: [{ name: 'Splash' }],
            })
          },
        },
      ]
    )
  }

  function calculateAge(dob) {
    if (!dob) return ''
    const parts = dob.split('/')
    if (parts.length !== 3) return ''
    const birthYear = parseInt(parts[2])
    return new Date().getFullYear() - birthYear
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <DiagonalWeave />
        <ActivityIndicator color={colors.champagne} />
      </View>
    )
  }

  if (!profile) {
    return (
      <View style={styles.emptyContainer}>
        <DiagonalWeave />
        <Text style={styles.logo}>Neli</Text>
        <Text style={styles.emptyTitle}>Profile not found</Text>
        <Text style={styles.emptyText}>
          It looks like your profile isn't set up yet
        </Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Step1Name')}
        >
          <Text style={styles.btnText}>Complete your profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signOutBtnStandalone} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.wrapper}>
      <DiagonalWeave />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.topNav}>
          <Text style={styles.logo}>Neli</Text>
          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign out</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {profile.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </Text>
          </View>
          {profile.is_verified ? (
            <View style={styles.verifiedBadge}>
              <Feather name="check-circle" size={12} color="#5ecb96" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.verifyBtn}
              onPress={() => navigation.navigate('Step7Verify')}
            >
              <Feather name="shield" size={12} color={colors.champagne} />
              <Text style={styles.verifyBtnText}>Verify your identity</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Name and basic info */}
        <View style={styles.nameSection}>
          <Text style={styles.name}>{profile.full_name}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>{calculateAge(profile.date_of_birth)} years old</Text>
            <Text style={styles.infoDot}>·</Text>
            <Text style={styles.infoText}>{profile.nationality}</Text>
            <Text style={styles.infoFlag}>{profile.country_flag}</Text>
          </View>
          {profile.mbti_type && (
            <View style={styles.mbtiBadge}>
              <Text style={styles.mbtiText}>✦ {profile.mbti_type} · {profile.mbti_name}</Text>
            </View>
          )}
        </View>

        {/* Bio */}
        {profile.bio && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>About</Text>
              <TouchableOpacity>
                <Text style={styles.editBtn}>Edit</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </View>
        )}

        {/* Prompts */}
        {profile.profile_prompts?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Prompts</Text>
              <TouchableOpacity>
                <Text style={styles.editBtn}>Edit</Text>
              </TouchableOpacity>
            </View>
            {profile.profile_prompts.map((prompt, i) => (
              <View key={i} style={styles.promptBlock}>
                <Text style={styles.promptQ}>{prompt.prompt_question}</Text>
                <Text style={styles.promptA}>"{prompt.prompt_answer}"</Text>
              </View>
            ))}
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Chats</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Feather
              name={profile.is_verified ? 'check-circle' : 'circle'}
              size={22}
              color={profile.is_verified ? '#5ecb96' : colors.taupeLight}
            />
            <Text style={styles.statLabel}>Verified</Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Settings</Text>
          {[
            { icon: 'map-pin', label: 'Browse location' },
            { icon: 'bell', label: 'Notifications' },
            { icon: 'lock', label: 'Privacy' },
            { icon: 'help-circle', label: 'Help & Support' },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Feather name={item.icon} size={15} color={colors.champagne} />
                </View>
                <Text style={styles.settingText}>{item.label}</Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.taupeLight} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.deleteBtn}>
          <Text style={styles.deleteBtnText}>Delete account</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.obsidian,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.obsidian,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.obsidian,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  scroll: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
    paddingBottom: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.line,
  },
  logo: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 28,
    color: colors.champagne,
  },
  signOutBtn: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderWidth: 0.5,
    borderColor: colors.line,
    borderRadius: radius.full,
  },
  signOutBtnStandalone: {
    marginTop: spacing.md,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderWidth: 0.5,
    borderColor: colors.line,
    borderRadius: radius.full,
  },
  signOutText: {
    fontSize: 12,
    color: colors.taupeLight,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.obsidian2,
    borderWidth: 2,
    borderColor: colors.champagne,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 32,
    color: colors.champagne,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(42,107,74,0.2)',
    borderWidth: 0.5,
    borderColor: '#2A6B4A',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: '#5ecb96',
  },
  verifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(232,213,163,0.08)',
    borderWidth: 0.5,
    borderColor: colors.champagne,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  verifyBtnText: {
    fontSize: 12,
    color: colors.champagne,
  },
  nameSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  name: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 28,
    color: colors.parch,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoText: {
    fontSize: 14,
    color: colors.taupeLight,
  },
  infoDot: {
    fontSize: 14,
    color: colors.taupeLight,
  },
  infoFlag: {
    fontSize: 16,
  },
  mbtiBadge: {
    backgroundColor: 'rgba(232,213,163,0.08)',
    borderWidth: 0.5,
    borderColor: colors.champagne,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    marginTop: spacing.xs,
  },
  mbtiText: {
    fontSize: 12,
    color: colors.champagne,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    fontSize: 10,
    color: colors.champagne,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  editBtn: {
    fontSize: 12,
    color: colors.taupeLight,
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
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    backgroundColor: colors.obsidian2,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.line,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 22,
    color: colors.champagne,
    fontWeight: '500',
  },
  statLabel: {
    fontSize: 11,
    color: colors.taupeLight,
  },
  statDivider: {
    width: 0.5,
    backgroundColor: colors.line,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.line,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.obsidian2,
    borderWidth: 0.5,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: {
    fontSize: 14,
    color: colors.parch,
  },
  deleteBtn: {
    marginHorizontal: spacing.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  deleteBtnText: {
    fontSize: 13,
    color: colors.rose,
    opacity: 0.7,
  },
  emptyTitle: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 28,
    color: colors.parch,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  emptyText: {
    fontSize: 14,
    color: colors.taupeLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  btn: {
    backgroundColor: colors.champagne,
    padding: spacing.md,
    borderRadius: radius.full,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  btnText: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 18,
    color: colors.obsidian,
  },
})