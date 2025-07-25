import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserData {
  id: string;
  full_name: string;
  email: string;
}

export const tokenManager = {
  TOKEN_KEY: 'userToken',
  EMAIL_KEY: 'userEmail',
  USER_DATA_KEY: 'userData',

  async saveAuthData(token: string, email: string, userData?: UserData): Promise<void> {
    
    try {
      await AsyncStorage.setItem(this.TOKEN_KEY, token);
      await AsyncStorage.setItem(this.EMAIL_KEY, email);
      if (userData) {
        await AsyncStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
      }
      console.log('✅ Auth data saved successfully')
    } catch (error) {
      console.error('❌ Error saving auth data:', error);
      throw new Error('Failed to save authentication data');
    }
  },

  // Get stored token
  async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(this.TOKEN_KEY);
      console.log('🔍 TokenManager: Retrieved token:', token ? 'found' : 'not found')
      return token;
    } catch (error) {
      console.error('❌ Error getting token:', error);
      return null;
    }
  },

  async getEmail(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.EMAIL_KEY);
    } catch (error) {
      console.error('Error getting email:', error);
      return null;
    }
  },

  async getUserData(): Promise<UserData | null> {
    try {
      const userData = await AsyncStorage.getItem(this.USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return token !== null;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },

  
  async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.TOKEN_KEY,
        this.EMAIL_KEY,
        this.USER_DATA_KEY
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw new Error('Failed to clear authentication data');
    }
  },

  
  async getAuthHeader(): Promise<{ Authorization?: string }> {
    try {
      const token = await this.getToken();
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch (error) {
      console.error('Error getting auth header:', error);
      return {};
    }
  }
};
