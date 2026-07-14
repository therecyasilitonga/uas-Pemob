import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Auth & Main Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainTabNavigator from './MainTabNavigator';

// New Checkout & Purchase Flow Screens
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import AddProductScreen from '../screens/AddProductScreen';

// New Profile Sub-Screens
import EditProfileScreen from '../screens/EditProfileScreen';
import ShippingAddressScreen from '../screens/ShippingAddressScreen';
import PaymentMethodScreen from '../screens/PaymentMethodScreen';
import NotificationScreen from '../screens/NotificationScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import AboutScreen from '../screens/AboutScreen';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/theme';

const Stack = createNativeStackNavigator();

/**
 * Root navigator: menerapkan auth-gate.
 * Pengguna WAJIB login dulu sebelum bisa mengakses menu utama (bottom tabs).
 */
export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            {/* Menu Utama (Bottom Tabs) */}
            <Stack.Screen name="Main" component={MainTabNavigator} />
            
            {/* Alur Pembelian / Jual Beli */}
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
            <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
            <Stack.Screen name="AddProduct" component={AddProductScreen} />

            
            {/* Menu Profil Sub-Halaman */}
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="ShippingAddress" component={ShippingAddressScreen} />
            <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
            <Stack.Screen name="Notification" component={NotificationScreen} />
            <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
