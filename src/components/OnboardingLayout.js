import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import Svg, { Line, Rect, Circle } from 'react-native-svg'

const { width, height } = Dimensions.get('window')

const COLORS = {
  obsidian: '#080808',
  champagne: '#E8D5A3',
  gold: '#C9A84C',
  parch: '#F0EDE8',
  taupeLight: 'rgba(240,237,232,0.4)',
  line: '#2A2A2A',
}

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
}

export function DiagonalWeave() {
  const lines = []
  const gap = 30

  for (let i = -height; i < width + height; i += gap) {
    lines.push(
      <Line key={`d1-${i}`} x1={i} y1={0} x2={i + height} y2={height} stroke="#1a1a1a" strokeWidth="0.5" />
    )
    lines.push(
      <Line key={`d2-${i}`} x1={i} y1={0} x2={i - height} y2={height} stroke="#1a1a1a" strokeWidth="0.5" />
    )
  }

  const particles = [
    { cx: width * 0.15, cy: height * 0.08, r: 1.2, color: '#E8D5A3', opacity: 0.7 },
    { cx: width * 0.82, cy: height * 0.06, r: 0.9, color: '#C9A84C', opacity: 0.5 },
    { cx: width * 0.92, cy: height * 0.22, r: 1.4, color: '#E8D5A3', opacity: 0.6 },
    { cx: width * 0.05, cy: height * 0.35, r: 0.8, color: '#C9A84C', opacity: 0.4 },
    { cx: width * 0.68, cy: height * 0.18, r: 1.0, color: '#E8D5A3', opacity: 0.5 },
    { cx: width * 0.35, cy: height * 0.12, r: 0.7, color: '#E8D5A3', opacity: 0.6 },
    { cx: width * 0.95, cy: height * 0.48, r: 1.1, color: '#C9A84C', opacity: 0.4 },
    { cx: width * 0.12, cy: height * 0.55, r: 0.9, color: '#E8D5A3', opacity: 0.5 },
    { cx: width * 0.55, cy: height * 0.72, r: 1.3, color: '#C9A84C', opacity: 0.35 },
    { cx: width * 0.78, cy: height * 0.65, r: 0.8, color: '#E8D5A3', opacity: 0.5 },
    { cx: width * 0.22, cy: height * 0.78, r: 1.0, color: '#C9A84C', opacity: 0.4 },
    { cx: width * 0.88, cy: height * 0.82, r: 0.7, color: '#E8D5A3', opacity: 0.6 },
    { cx: width * 0.42, cy: height * 0.88, r: 1.2, color: '#E8D5A3', opacity: 0.4 },
    { cx: width * 0.08, cy: height * 0.92, r: 0.9, color: '#C9A84C', opacity: 0.5 },
    { cx: width * 0.65, cy: height * 0.95, r: 1.1, color: '#E8D5A3', opacity: 0.35 },
    { cx: width * 0.50, cy: height * 0.05, r: 0.8, color: '#C9A84C', opacity: 0.5 },
    { cx: width * 0.30, cy: height * 0.45, r: 0.6, color: '#E8D5A3', opacity: 0.4 },
    { cx: width * 0.75, cy: height * 0.38, r: 1.0, color: '#C9A84C', opacity: 0.45 },
  ]

  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
      <Rect width={width} height={height} fill="#080808" />
      {lines}
      {particles.map((p, i) => (
        <Circle key={`p-${i}`} cx={p.cx} cy={p.cy} r={p.r} fill={p.color} opacity={p.opacity} />
      ))}
    </Svg>
  )
}

export default function OnboardingLayout({
  step, totalSteps = 7, title, subtitle, onBack, children
}) {
  return (
    <View style={styles.container}>
      <DiagonalWeave />
      <View style={styles.progressRow}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressSegment,
              i < step ? styles.progressActive : styles.progressInactive,
            ]}
          />
        ))}
      </View>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.logo}>Neli</Text>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },
  progressRow: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: SPACING.lg,
    paddingTop: 52,
    zIndex: 1,
  },
  progressSegment: {
    flex: 1,
    height: 2,
    borderRadius: 2,
  },
  progressActive: {
    backgroundColor: COLORS.champagne,
  },
  progressInactive: {
    backgroundColor: COLORS.line,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    zIndex: 1,
  },
  backBtn: {
    marginBottom: SPACING.sm,
  },
  backText: {
    color: COLORS.champagne,
    fontSize: 14,
  },
  logo: {
    fontFamily: 'Italiana_400Regular',
    fontSize: 28,
    color: COLORS.champagne,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: COLORS.parch,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.taupeLight,
    lineHeight: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    zIndex: 1,
  },
})