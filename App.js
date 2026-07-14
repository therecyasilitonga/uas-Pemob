import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import { ProductProvider } from './src/context/ProductContext';
import { WishlistProvider } from './src/context/WishlistContext';
import { OrderProvider } from './src/context/OrderContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ProductProvider>
            <WishlistProvider>
              <OrderProvider>
                <StatusBar style="dark" />
                <RootNavigator />
              </OrderProvider>
            </WishlistProvider>
          </ProductProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}


