import { Alert } from 'react-native';
import { router } from 'expo-router';
import { tokenManager } from './tokenManager';

export const logoutHelper = {
  async logoutWithConfirmation(): Promise<void> {
    Alert.alert(
      'Logout',
      'Apakah Anda yakin ingin keluar?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: () => this.performLogout(),
        },
      ]
    );
  },

  async performLogout(): Promise<void> {
    try {
      await tokenManager.clearAuthData();
      
      Alert.alert(
        'Berhasil',
        'Anda telah berhasil logout',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/auth/login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Terjadi kesalahan saat logout',
        [{ text: 'OK' }]
      );
    }
  },

  async silentLogout(): Promise<void> {
    try {
      await tokenManager.clearAuthData();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Silent logout error:', error);
    }
  },
};
