import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import SplashScreen from '../screens/auth/SplashScreen'
import SignInScreen from '../screens/auth/SignInScreen'
import SignUpScreen from '../screens/auth/SignUpScreen'
import Step1Name from '../screens/onboarding/Step1Name'
import Step2Gender from '../screens/onboarding/Step2Gender'
import Step3Nationality from '../screens/onboarding/Step3Nationality'
import Step4Bio from '../screens/onboarding/Step4Bio'
import Step5Prompts from '../screens/onboarding/Step5Prompts'
import Step6Photos from '../screens/onboarding/Step6Photos'
import Step7Verify from '../screens/onboarding/Step7Verify'
import Step8Personality from '../screens/onboarding/Step8Personality'
import MainNavigator from './MainNavigator'

const Stack = createStackNavigator()

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Step1Name" component={Step1Name} />
        <Stack.Screen name="Step2Gender" component={Step2Gender} />
        <Stack.Screen name="Step3Nationality" component={Step3Nationality} />
        <Stack.Screen name="Step4Bio" component={Step4Bio} />
        <Stack.Screen name="Step5Prompts" component={Step5Prompts} />
        <Stack.Screen name="Step6Photos" component={Step6Photos} />
        <Stack.Screen name="Step7Verify" component={Step7Verify} />
        <Stack.Screen name="Step8Personality" component={Step8Personality} />
        <Stack.Screen name="MainApp" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}