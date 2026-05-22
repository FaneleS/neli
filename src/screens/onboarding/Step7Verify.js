import { useState } from 'react'
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, Alert, ActivityIndicator
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Feather } from '@expo/vector-icons'
import { colors, radius, spacing } from '../../constants/theme'
import { DiagonalWeave } from '../../components/OnboardingLayout'
import { supabase } from '../../../lib/supabase'

export default function Step7Verify({ navigation, route }) {
  const [idPhoto, setIdPhoto] = useState(null)
  const [selfie, setSelfie] = useState(null)
  const [loading, setLoading] = useState(false)
  const params = route.params || {}

  async function pickID() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') return
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
    })
    if (!result.canceled) setIdPhoto(result.assets[0].uri)
  }

  async function takeSelfie() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      })
      if (!result.canceled) setSelfie(result.assets[0].uri)
      return
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    })
    if (!result.canceled) setSelfie(result.assets[0].uri)
  }

  async function handleComplete() {
    if (!idPhoto || !selfie) return Alert.alert('Please upload your ID and take a selfie')
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: params.fullName,
          date_of_birth: params.dob,
          gender: params.gender,
          nationality: params.nationality,
          country_flag: params.countryFlag,
          bio: params.bio,
          verification_status: 'pending',
        })
      if (profileError) throw profileError
      const { error: verifyError } = await supabase
        .from('verifications')
        .insert({ user_id: user.id, status: 'pending' })
      if (verifyError) throw verifyError
      setLoading(false)
      navigation.navigate('Step8Personality', { ...params })
    } catch (error) {
      setLoading(false)
      Alert.alert('Error', error.message)
    }
  }

  return (
    <View style={styles.wrapper}>
      <DiagonalWeave />
      <View style={styles.progressRow}>
        {Array.from({ length: 8 }).map((_, i) => (
          <View key={i} style={[
            styles.progressSegment,
            i < 7 ? styles.progressActive : styles.progressInactive
          ]} />
        ))}
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.logo}>Neli</Text>
          <Text style={styles.title}>Verify your identity</Text>
          <Text style={styles.subtitle}>Neli verifies every member to keep our community safe</Text>
        </View>

        <View style={styles.safetyBanner}>
          <Feather name="lock" size={16} color="#5ecb96" />
          <Text style={styles.safetyText}>
            Your documents are encrypted and never shared with other users. Verification keeps Neli genuine and safe.
          </Text>
        </View>

        <Text style={styles.stepLabel}>Step 1 — Upload ID document</Text>
        <Text style={styles.stepSub}>Passport, Driver's licence or National ID</Text>
        <TouchableOpacity
          style={[styles.uploadBtn, idPhoto && styles.uploadBtnDone]}
          onPress={pickID}
        >
          <Feather
            name={idPhoto ? 'check-circle' : 'upload'}
            size={20}
            color={idPhoto ? '#5ecb96' : colors.taupeLight}
          />
          <Text style={[styles.uploadText, idPhoto && styles.uploadTextDone]}>
            {idPhoto ? 'ID uploaded successfully' : 'Tap to upload your ID'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.stepLabel}>Step 2 — Take a selfie</Text>
        <Text style={styles.stepSub}>We'll match your face to your ID photo</Text>
        <TouchableOpacity
          style={[styles.uploadBtn, selfie && styles.uploadBtnDone]}
          onPress={takeSelfie}
        >
          <Feather
            name={selfie ? 'check-circle' : 'camera'}
            size={20}
            color={selfie ? '#5ecb96' : colors.taupeLight}
          />
          <Text style={[styles.uploadText, selfie && styles.uploadTextDone]}>
            {selfie ? 'Selfie taken successfully' : 'Tap to take a selfie'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, (!idPhoto || !selfie || loading) && styles.btnDisabled]}
          onPress={handleComplete}
          disabled={!idPhoto || !selfie || loading}
        >
          {loading
            ? <ActivityIndicator color={colors.obsidian} />
            : <Text style={styles.btnText}>Complete my profile</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => navigation.navigate('Step8Personality', { ...params })}
        >
          <Text style={styles.skipText}>Skip for now — verify later</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: colors.obsidian },
  progressRow: { flexDirection: 'row', gap: 4, paddingHorizontal: spacing.lg, paddingTop: 52, zIndex: 1 },
  progressSegment: { flex: 1, height: 2, borderRadius: 2 },
  progressActive: { backgroundColor: colors.champagne },
  progressInactive: { backgroundColor: colors.line },
  scroll: { flex: 1, zIndex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  header: { paddingTop: spacing.md, marginBottom: spacing.lg },
  backText: { color: colors.champagne, fontSize: 14, marginBottom: spacing.sm },
  logo: { fontFamily: 'Italiana_400Regular', fontSize: 28, color: colors.champagne, marginBottom: spacing.xs },
  title: { fontSize: 24, fontWeight: '500', color: colors.parch, marginBottom: 4 },
  subtitle: { fontSize: 13, color: colors.taupeLight, lineHeight: 20 },
  safetyBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: 'rgba(42,107,74,0.15)',
    borderWidth: 0.5,
    borderColor: '#2A6B4A',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  safetyText: { flex: 1, fontSize: 12, color: '#5ecb96', lineHeight: 18 },
  stepLabel: { fontSize: 13, color: colors.champagne, fontWeight: '500', marginBottom: 4 },
  stepSub: { fontSize: 11, color: colors.taupeLight, marginBottom: spacing.sm, opacity: 0.7 },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.obsidian2,
    borderWidth: 0.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  uploadBtnDone: { borderColor: '#2A6B4A', backgroundColor: 'rgba(42,107,74,0.1)' },
  uploadText: { fontSize: 14, color: colors.taupeLight },
  uploadTextDone: { color: '#5ecb96' },
  btn: {
    backgroundColor: colors.champagne,
    padding: spacing.md,
    borderRadius: radius.full,
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { fontFamily: 'Italiana_400Regular', fontSize: 18, color: colors.obsidian },
  skipBtn: { alignItems: 'center', padding: spacing.md, marginBottom: spacing.lg },
  skipText: { fontSize: 12, color: colors.taupeLight, opacity: 0.6 },
})