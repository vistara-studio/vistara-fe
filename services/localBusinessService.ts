import { tokenManager } from "../utils/tokenManager";

const API_BASE_URL = 'http://einrafh.com:8080/api';

export interface LocalBusiness {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  province: string;
  longitude: string;
  latitude: string;
  label: string;
  opened_time: string;
  photo_url: string;
  is_business: boolean;
  created_at: string;
  // Legacy fields for frontend compatibility
  type?: string;
  rating?: number;
  image?: string;
  hours?: string;
  category?: string;
  reviews?: number;
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  facilities?: string[];
  price_range?: string;
  updated_at?: string;
}

export interface LocalBusinessResponse {
  message: string;
  payload: LocalBusiness[];
}

export interface LocalBusinessDetailResponse {
  message: string;
  payload: LocalBusiness;
}

export interface LocalBusinessFilters {
  city?: string;
  type?: string;
}

export const localBusinessService = {
  // Get list of local businesses with filters
  async getLocalBusinesses(filters: LocalBusinessFilters = {}): Promise<LocalBusinessResponse> {
    try {
      const params = new URLSearchParams();
      
      // Add filters to params
      if (filters.city) {
        params.append('city', filters.city);
      }
      
      if (filters.type) {
        params.append('type', filters.type);
      } else {
        params.append('type', 'business'); // Default type
      }

      const url = `${API_BASE_URL}/locals?${params.toString()}`;
      console.log('🌐 LocalBusinessService: Fetching local businesses from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
           'Authorization': `Bearer ${await tokenManager.getToken()}`
        },
      });

      console.log('📥 LocalBusinessService: Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch local businesses`);
      }

      const data = await response.json();
      console.log('📦 LocalBusinessService: Response data:', JSON.stringify(data, null, 2));

      // Ensure the response has the expected format
      if (!data.message || !Array.isArray(data.payload)) {
        throw new Error('Invalid response format from backend');
      }

      // Process data to add legacy compatibility fields
      const processedPayload = data.payload.map((item: LocalBusiness) => ({
        ...item,
        // Add legacy fields for frontend compatibility
        type: item.is_business ? 'business' : 'tour',
        category: item.label,
        hours: item.opened_time,
        image: item.photo_url,
        // Convert string coordinates to numbers for legacy compatibility
        latitude: parseFloat(item.latitude),
        longitude: parseFloat(item.longitude),
        // Add default rating and reviews if needed by frontend
        rating: 4.5, // You can remove this if not needed
        reviews: 100 // You can remove this if not needed
      }));

      return {
        message: data.message,
        payload: processedPayload
      };

    } catch (error: any) {
      console.error('❌ LocalBusinessService: Error fetching local businesses:', error);
      throw new Error(error.message || 'Network error occurred');
    }
  },

  // Get local business detail by ID
  async getLocalBusinessById(id: string): Promise<LocalBusinessDetailResponse> {
    try {
      const url = `${API_BASE_URL}/locals/${id}`;
      console.log('🌐 LocalBusinessService: Fetching local business detail from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await tokenManager.getToken()}`,
        },
      });

      console.log('📥 LocalBusinessService: Detail response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch local business detail`);
      }

      const data = await response.json();
      console.log('📦 LocalBusinessService: Detail response data:', JSON.stringify(data, null, 2));

      // Ensure the response has the expected format
      if (!data.message || !data.payload) {
        throw new Error('Invalid response format from backend');
      }

      // Process data to add legacy compatibility fields
      const processedPayload = {
        ...data.payload,
        // Add legacy fields for frontend compatibility
        type: data.payload.is_business ? 'business' : 'tour',
        category: data.payload.label,
        hours: data.payload.opened_time,
        image: data.payload.photo_url,
        // Convert string coordinates to numbers for legacy compatibility
        latitude: parseFloat(data.payload.latitude),
        longitude: parseFloat(data.payload.longitude),
        // Add default rating and reviews if needed by frontend
        rating: 4.5, // You can remove this if not needed
        reviews: 100 // You can remove this if not needed
      };

      return {
        message: data.message,
        payload: processedPayload
      };

    } catch (error: any) {
      console.error('❌ LocalBusinessService: Error fetching local business detail:', error);
      throw new Error(error.message || 'Network error occurred');
    }
  },

  // Get local businesses by city (helper method)
  async getLocalBusinessesByCity(city: string, type: string = 'business'): Promise<LocalBusinessResponse> {
    return this.getLocalBusinesses({ city, type });
  },

  // Search local businesses (if needed for future)
  async searchLocalBusinesses(query: string, filters: LocalBusinessFilters = {}): Promise<LocalBusinessResponse> {
    try {
      const params = new URLSearchParams();
      params.append('search', query);
      
      if (filters.city) {
        params.append('city', filters.city);
      }
      
      if (filters.type) {
        params.append('type', filters.type);
      }

      const url = `${API_BASE_URL}/locals/search?${params.toString()}`;
      console.log('🔍 LocalBusinessService: Searching local businesses:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await tokenManager.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to search local businesses`);
      }

      const data = await response.json();
      console.log('📦 LocalBusinessService: Search response data:', JSON.stringify(data, null, 2));

      // Ensure the response has the expected format
      if (!data.message || !Array.isArray(data.payload)) {
        throw new Error('Invalid response format from backend');
      }

      // Process data to add legacy compatibility fields
      const processedPayload = data.payload.map((item: LocalBusiness) => ({
        ...item,
        type: item.is_business ? 'business' : 'tour',
        category: item.label,
        hours: item.opened_time,
        image: item.photo_url,
        latitude: parseFloat(item.latitude),
        longitude: parseFloat(item.longitude),
        rating: 4.5, // You can remove this if not needed
        reviews: 100 // You can remove this if not needed
      }));

      return {
        message: data.message,
        payload: processedPayload
      };

    } catch (error: any) {
      console.error('❌ LocalBusinessService: Error searching local businesses:', error);
      throw new Error(error.message || 'Network error occurred');
    }
  }
};
