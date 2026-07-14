import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';
import HomeStackNavigator from './HomeStackNavigator';
import WishlistScreen from '../screens/WishlistScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useWishlist } from '../context/WishlistContext';
import { colors } from '../theme/theme';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: { active: 'home', inactive: 'home-outline' },
  Wishlist: { active: 'heart', inactive: 'heart-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

function TabIcon({ route, focused, color }) {
  const { count } = useWishlist();
  const iconSet = ICONS[route.name];
  const name = focused ? iconSet.active : iconSet.inactive;

  return (
    <View>
      <Ionicons name={name} size={22} color={color} />
      {route.name === 'Wishlist' && count > 0 && (
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
        </View>
      )}
    </View>
  );
}

// Bottom tab navigation utama: Home, Wishlist, Profil.
export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused, color }) => <TabIcon route={route} focused={focused} color={color} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} options={{ tabBarLabel: 'Beranda' }} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} options={{ tabBarLabel: 'Wishlist' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profil' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 88 : 72,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E7E9F3',
    backgroundColor: colors.surface,
  },
  tabBarLabel: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  badge: { position: 'absolute', top: -2, right: -6 },
  badgeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF6B81' },
});

