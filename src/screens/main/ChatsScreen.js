import { View, Text, StyleSheet } from 'react-native'
import { DiagonalWeave } from '../../components/OnboardingLayout'
import { colors } from '../../constants/theme'

export default function ChatsScreen() {
  return (
    <View style={styles.container}>
      <DiagonalWeave />
      <Text style={styles.logo}>Neli</Text>
      <Text style={styles.text}>Chats coming soon</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.obsidian, alignItems: 'center', justifyContent: 'center' },
  logo: { fontFamily: 'Italiana_400Regular', fontSize: 32, color: colors.champagne, marginBottom: 8 },
  text: { color: colors.taupeLight, fontSize: 14 },
})