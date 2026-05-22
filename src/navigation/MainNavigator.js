import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, Text, StyleSheet } from 'react-native'
import BrowseScreen from '../screens/main/BrowseScreen'
import MatchesScreen from '../screens/main/MatchesScreen'
import ChatsScreen from '../screens/main/ChatsScreen'
import ProfileScreen from '../screens/main/ProfileScreen'

const Tab = createBottomTabNavigator()

function TabIcon({ label, icon, focused }) {
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{icon}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  )
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Browse"
        component={BrowseScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Browse" icon="⊞" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Matches"
        component={MatchesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Matches" icon="♡" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Chats" icon="◯" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Profile" icon="◈" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#080808',
    borderTopWidth: 0.5,
    borderTopColor: '#2A2A2A',
    height: 60,
    paddingBottom: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabIcon: {
    fontSize: 20,
    color: '#2A2A2A',
  },
  tabIconActive: {
    color: '#E8D5A3',
  },
  tabLabel: {
    fontSize: 9,
    color: '#2A2A2A',
  },
  tabLabelActive: {
    color: '#E8D5A3',
  },
})