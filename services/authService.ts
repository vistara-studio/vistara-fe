const API_BASE_URL = 'http://einrafh.com:8080/api';

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success?: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      id: string;
      full_name: string;
      email: string;
    };
  };
  payload?: {
    token: string;
    user?: {
      id: string;
      full_name: string;
      email: string;
    };
  };
}

export const authService = {
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Network error occurred');
    }
  },

  async login(userData: LoginRequest): Promise<LoginResponse> {
    console.log('🔌 AuthService: Starting login request')
    console.log('📡 Request URL:', `${API_BASE_URL}/auth/login`)
    console.log('📤 Request headers:', { 'Content-Type': 'application/json' })
    console.log('📤 Request body:', { 
      email: userData.email, 
      password: '***hidden***' 
    })
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log('❌ Response not OK, throwing error')
        console.log('🔍 Error data:', data)
        throw new Error(data.message || 'Login failed');
      }

      console.log('✅ Login request successful')
      return data;
    } catch (error: any) {
      console.log('💥 AuthService login error occurred')
      console.log('🔍 Error type:', error.constructor.name)
      console.log('🔍 Error message:', error.message)
      console.log('🔍 Error stack:', error.stack)
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.log('🌐 Network error detected - possible connection issue')
      }
      
      throw new Error(error.message || 'Network error occurred');
    }
  },
};
