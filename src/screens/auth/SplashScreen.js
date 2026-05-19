import { useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import Svg, { Line, Rect } from 'react-native-svg'
import { colors, radius, spacing } from '../../constants/theme'

const { width, height } = Dimensions.get('window')

function DiagonalWeave() {
  const lines = []
  const gap = 30

  for (let i = -height; i < width + height; i += gap) {
    lines.push(
      <Line
        key={`d1-${i}`}
        x1={i} y1={0}
        x2={i + height} y2={height}
        stroke="#4A3728"
        strokeWidth="0.4"
      />
    )
    lines.push(
      <Line
        key={`d2-${i}`}
        x1={i} y1={0}
        x2={i - height} y2={height}
        stroke="#4A3728"
        strokeWidth="0.4"
      />
    )
  }

  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
    >
      <Rect width={width} height={height} fill={colors.esp} />
      {lines}
    </Svg>
  )
}

export default function SplashScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <DiagonalWeave />

      <View style={styles.center}>
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
    backgroundColor: colors.esp,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  logo: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 80,
    color: colors.gold,
    lineHeight: 88,
  },
  tagline: {
    fontSize: 13,
    color: colors.taupeLight,
    letterSpacing: 2,
    marginTop: spacing.sm,
  },
  divider: {
    width: 40,
    height: 0.5,
    backgroundColor: colors.goldDim,
    marginTop: spacing.lg,
  },
  buttons: {
    gap: spacing.sm,
    zIndex: 1,
  },
  btnPrimary: {
    backgroundColor: colors.gold,
    padding: spacing.md,
    borderRadius: radius.full,
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 18,
    color: colors.esp,
  },
  btnGhost: {
    backgroundColor: 'transparent',
    padding: spacing.md,
    borderRadius: radius.full,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: colors.goldDim,
  },
  btnGhostText: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 18,
    color: colors.gold,
  },
  legal: {
    fontSize: 10,
    color: colors.taupeLight,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: spacing.sm,
  },
})