import { useState } from 'react'
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, Alert, Image
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import OnboardingLayout from '../../components/OnboardingLayout'
import { colors, radius, spacing } from '../../constants/theme'

export default function Step6Photos({ navigation, route }) {
  const [photos, setPhotos] = useState([])

  async function pickPhoto() {
    if (photos.length >= 6) {
      return Alert.alert('Maximum 6 photos allowed')
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      return Alert.alert('Permission needed', 'Please allow access to your photo library')
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    })
    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri])
    }
  }

  function removePhoto(index) {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  function handleNext() {
    if (photos.length < 2) {
      return Alert.alert('Please add at least 2 photos')
    }
    navigation.navigate('Step7Verify', { ...route.params, photos })
  }

  return (
    <OnboardingLayout
      step={6}
      title="Your photos"
      subtitle="Add at least 2 photos — be yourself!"
      onBack={() => navigation.goBack()}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {photos.map((uri, index) => (
            <View key={index} style={styles.photoContainer}>
              <Image source={{ uri }} style={styles.photo} />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removePhoto(index)}
              >
                <Text style={styles.removeBtnText}>✕</Text>
              </TouchableOpacity>
              {index === 0 && (
                <View style={styles.mainBadge}>
                  <Text style={styles.mainBadgeText}>Main</Text>
                </View>
              )}
            </View>
          ))}

          {photos.length < 6 && (
            <TouchableOpacity style={styles.addBtn} onPress={pickPhoto}>
              <Text style={styles.addBtnIcon}>+</Text>
              <Text style={styles.addBtnText}>Add photo</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.hint}>
          ✦ First photo is your main profile photo
        </Text>
        <Text style={styles.hint}>
          ✦ Clear face photos get more matches
        </Text>
        <Text style={styles.hint}>
          ✦ No filters needed — Neli celebrates the real you
        </Text>

        <TouchableOpacity
          style={[styles.btn, photos.length < 2 && styles.btnDisabled]}
          onPress={handleNext}
          disabled={photos.length < 2}
        >
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </OnboardingLayout>
  )
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  photoContainer: {
    width: '47%',
    aspectRatio: 3 / 4,
    borderRadius: radius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    color: '#fff',
    fontSize: 12,
  },
  mainBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: colors.champagne,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  mainBadgeText: {
    fontSize: 10,
    color: colors.obsidian,
    fontWeight: '600',
  },
  addBtn: {
    width: '47%',
    aspectRatio: 3 / 4,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.line,
    borderStyle: 'dashed',
    backgroundColor: colors.obsidian2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  addBtnIcon: {
    fontSize: 28,
    color: colors.taupeLight,
  },
  addBtnText: {
    fontSize: 12,
    color: colors.taupeLight,
  },
  hint: {
    fontSize: 12,
    color: colors.taupeLight,
    marginBottom: spacing.sm,
    lineHeight: 18,
    opacity: 0.7,
  },
  btn: {
    backgroundColor: colors.champagne,
    padding: spacing.md,
    borderRadius: radius.full,
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
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