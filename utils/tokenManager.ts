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
  DEBUG_MODE: false, // Set to true for debugging

  async saveAuthData(token: string, email: string, userData?: UserData): Promise<void> {
    
    try {
      await AsyncStorage.setItem(this.TOKEN_KEY, token);
      await AsyncStorage.setItem(this.EMAIL_KEY, email);
      if (userData) {
        await AsyncStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
      }
      if (this.DEBUG_MODE) console.log('✅ Auth data saved successfully')
    } catch (error) {
      console.error('❌ Error saving auth data:', error);
      throw new Error('Failed to save authentication data');
    }
  },

  // Get stored token
  async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(this.TOKEN_KEY);
      // Only log when explicitly needed for debugging
      // console.log('🔍 TokenManager: Retrieved token:', token ? 'found' : 'not found')
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

    // Get auth status with user data in single call
  async getAuthStatus(): Promise<{ isAuthenticated: boolean; email: string | null; userData: UserData | null }> {
    try {
      const token = await AsyncStorage.getItem(this.TOKEN_KEY);
      const email = await AsyncStorage.getItem(this.EMAIL_KEY);
      const userData = await this.getUserData();
      
      if (this.DEBUG_MODE) {
        console.log('🔍 Auth Status Check:', {
          hasToken: !!token,
          hasEmail: !!email,
          hasUserData: !!userData
        });
      }
      
      return {
        isAuthenticated: !!token,
        email,
        userData
      };
    } catch (error) {
      console.error('Error getting auth status:', error);
      return {
        isAuthenticated: false,
        email: null,
        userData: null
      };
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
