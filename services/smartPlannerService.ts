import { tokenManager } from '../utils/tokenManager'
const API_BASE_URL = 'http://34.50.99.240:8080/api/ai'

export interface SmartPlannerRequest {
  destination: string
  start_date: string
  end_date: string
  budget: number
  activity_preferences: string[]
  travel_style: string
  activity_intensity: string
}

export interface SmartPlannerResponse {
  id: string
  destination: string
  start_date: string
  end_date: string
  budget: number
  activity_preferences: string[]
  travel_style: string
  activity_intensity: string
  itinerary: ItineraryDay[]
  created_at: string
  updated_at: string
}

export interface ItineraryDay {
  day: number
  date: string
  activities: Activity[]
}

export interface Activity {
  id: string
  time: string
  name: string
  description: string
  notes?: string
  duration: string
  price_range: {
    min: number
    max: number
  }
  location?: {
    latitude: number
    longitude: number
    address: string
  }
  type: 'attraction' | 'local_business' | 'activity'
}

class SmartPlannerService {
  // Helper method to validate request format
  private validateRequest(request: SmartPlannerRequest): void {
    console.log('Validating request:', request)
    
    if (!request.destination) throw new Error('Destination is required')
    if (!request.start_date) throw new Error('Start date is required')
    if (!request.end_date) throw new Error('End date is required')
    if (!request.budget || request.budget <= 0) throw new Error('Valid budget is required')
    if (!request.activity_preferences || request.activity_preferences.length === 0) {
      throw new Error('At least one activity preference is required')
    }
    if (!request.travel_style) throw new Error('Travel style is required')
    if (!request.activity_intensity) throw new Error('Activity intensity is required')
  }

  async generatePlan(request: SmartPlannerRequest): Promise<SmartPlannerResponse> {
    try {
      // Validate request before sending
      this.validateRequest(request)
      
      const token = await tokenManager.getToken()
      
      console.log('=== BACKEND REQUEST DEBUG ===')
      console.log('API Endpoint:', `${API_BASE_URL}/smart-planner`)
      console.log('Request Method: POST')
      console.log('Request Headers:', {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token.substring(0, 20)}...` : 'No token'
      })
      console.log('Request Body (Raw):', request)
      console.log('Request Body (JSON):', JSON.stringify(request, null, 2))
      console.log('Request Body (Stringified for network):', JSON.stringify(request))
      console.log('Body Size:', JSON.stringify(request).length, 'characters')
      
      const requestBody = JSON.stringify(request)
      console.log('=== SENDING TO BACKEND NOW ===')
      
      const response = await fetch(`${API_BASE_URL}/smart-planner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: requestBody,
      })

      console.log('=== BACKEND RESPONSE ===')
      console.log('Response status:', response.status)
      console.log('Response status text:', response.statusText)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        console.log('=== ERROR RESPONSE DETAILS ===')
        const errorText = await response.text()
        console.log('Error response body:', errorText)
        
        try {
          const errorJson = JSON.parse(errorText)
          console.log('Error response parsed:', errorJson)
        } catch (parseError) {
          console.log('Error response is not valid JSON')
        }
        
        console.log('Request that caused error:')
        console.log('- URL:', `${API_BASE_URL}/smart-planner`)
        console.log('- Method: POST')
        console.log('- Body sent:', requestBody)
        console.log('=== END ERROR DETAILS ===')
        
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('=== SUCCESS RESPONSE ===')
      console.log('Response data (raw):', data)
      console.log('Response data (formatted):', JSON.stringify(data, null, 2))
      console.log('Response data type:', typeof data)
      console.log('Response data keys:', Object.keys(data || {}))
      console.log('=== END SUCCESS RESPONSE ===')
      return data
    } catch (error) {
      console.error('Error generating smart plan:', error)
      throw error
    }
  }
}

export const smartPlannerService = new SmartPlannerService()
