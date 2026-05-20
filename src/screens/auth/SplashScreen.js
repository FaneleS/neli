import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors, radius, spacing } from '../../constants/theme'
import { DiagonalWeave } from '../../components/OnboardingLayout'





export default function SplashScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <DiagonalWeave />
      <View style={styles.center}>
        <Text style={styles.eyebrow}>interracial dating</Text>
        <Text style={styles.logo}>Neli</Text>
        <Text style={styles.tagline}>love in every shade</Text>
        <View style={styles.divider} />
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.btnPrimaryText}>Begin your story</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnGhost}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={styles.btnGhostText}>Sign in</Text>
        </TouchableOpacity>
        <Text style={styles.legal}>
          By continuing you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.obsidian,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  eyebrow: {
    fontSize: 9,
    letterSpacing: 5,
    textTransform: 'uppercase',
    color: colors.champagne,
    marginBottom: spacing.sm,
    opacity: 0.7,
  },
  logo: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 88,
    color: colors.champagne,
    lineHeight: 96,
  },
  tagline: {
    fontSize: 12,
    color: colors.taupeLight,
    letterSpacing: 3,
    marginTop: spacing.xs,
  },
  divider: {
    width: 40,
    height: 0.5,
    backgroundColor: colors.lineBright || 'rgba(232,213,163,0.2)',
    marginTop: spacing.lg,
  },
  buttons: {
    gap: spacing.sm,
    zIndex: 1,
  },
  btnPrimary: {
    backgroundColor: colors.champagne,
    padding: spacing.md,
    borderRadius: radius.full,
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 18,
    color: colors.obsidian,
  },
  btnGhost: {
    backgroundColor: 'transparent',
    padding: spacing.md,
    borderRadius: radius.full,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(240,237,232,0.15)',
  },
  btnGhostText: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 18,
    color: 'rgba(240,237,232,0.5)',
  },
  legal: {
    fontSize: 10,
    color: colors.taupeLight,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: spacing.sm,
  },
})