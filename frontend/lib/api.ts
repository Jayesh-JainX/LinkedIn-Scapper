const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export interface CompanyData {
  name: string
  industry: string
  size: string
  headquarters: string
  founded?: number
  recentPosts: Post[]
  jobPostings: JobPosting[]
  employees: Employee[]
}

export interface Post {
  id: string
  content: string
  date: string
  engagement: number
  type: 'hiring' | 'expansion' | 'milestone' | 'general'
}

export interface JobPosting {
  id: string
  title: string
  location: string
  department: string
  datePosted: string
  requirements: string[]
  description?: string
  salary_range?: string
  employment_type?: string
}

export interface Employee {
  id: string
  name: string
  title: string
  department: string
  tenure: string
  skills: string[]
  recentActivity: string[]
}

export interface InsightData {
  hiringTrends: HiringTrend[]
  leadershipChanges: LeadershipChange[]
  branchExpansions: BranchExpansion[]
  competitorComparison: CompetitorData[]
  skillsTrends?: SkillTrend[]
}

export interface HiringTrend {
  department: string
  count: number
  trend: 'up' | 'down' | 'stable'
  keyRoles: string[]
  growth?: number
}

export interface LeadershipChange {
  name: string
  previousRole?: string
  newRole: string
  date: string
  type: 'hire' | 'promotion' | 'departure'
  department?: string
}

export interface BranchExpansion {
  location: string
  date: string
  type: 'office' | 'branch' | 'facility'
  details: string
  employee_count?: number
}

export interface SkillTrend {
  skill: string
  demand: number
  growth: number
  related_roles?: string[]
}

export interface CompetitorData {
  name: string
  hiringActivity: number
  leadershipChanges: number
  marketActivity: number
  employeeCount?: number
  recentExpansions?: number
  socialEngagement?: number
}

export interface ApiError {
  message: string
  code?: string
  details?: any
}

export interface ApiResponse<T> {
  data: T | null
  error: ApiError | null
  loading: boolean
}

class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor() {
    this.baseUrl = API_BASE_URL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      let data: any
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      if (!response.ok) {
        const errorMessage = this.getErrorMessage(data, response.status)
        throw new Error(errorMessage)
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout. Please try again.')
        }
        throw error
      }
      throw new Error('An unexpected error occurred. Please try again.')
    }
  }

  private getErrorMessage(data: any, status: number): string {
    // Handle different error response formats
    if (typeof data === 'string') {
      return `Server Error (${status}): ${data}`
    }
    
    if (data && typeof data === 'object') {
      return data.detail || data.message || data.error || `Server Error (${status})`
    }
    
    // Fallback for HTTP status codes
    switch (status) {
      case 400:
        return 'Bad request. Please check your input and try again.'
      case 401:
        return 'Unauthorized. Please check your credentials.'
      case 403:
        return 'Access forbidden. You do not have permission to perform this action.'
      case 404:
        return 'Resource not found. The requested data could not be found.'
      case 429:
        return 'Too many requests. Please wait a moment and try again.'
      case 500:
        return 'Internal server error. Please try again later.'
      case 502:
        return 'Bad gateway. The server is temporarily unavailable.'
      case 503:
        return 'Service unavailable. Please try again later.'
      default:
        return `Server Error (${status}). Please try again.`
    }
  }

  async analyzeCompany(companyName: string, competitors: string[] = []): Promise<CompanyData> {
    if (!companyName || !companyName.trim()) {
      throw new Error('Company name is required')
    }

    const requestBody = {
      company_name: companyName.trim(),
      competitors: competitors.filter(c => c.trim()),
      include_employees: true,
      include_posts: true,
      include_jobs: true,
      max_employees: 100,
      days_back: 30
    }

    console.log('Sending analysis request:', requestBody)
    
    try {
      const response = await this.request<CompanyData>('/companies/analyze', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      })
      
      console.log('Analysis response received:', response)
      return response
    } catch (error) {
      console.error('Analysis request failed:', error)
      throw error
    }
  }

  async getInsights(companyName: string): Promise<InsightData> {
    if (!companyName || !companyName.trim()) {
      throw new Error('Company name is required')
    }

    return this.request<InsightData>(`/insights/${encodeURIComponent(companyName.trim())}`)
  }

  async getCompetitorComparison(companies: string[]): Promise<CompetitorData[]> {
    if (!companies || companies.length === 0) {
      throw new Error('At least one company is required for comparison')
    }

    const validCompanies = companies.filter(c => c && c.trim()).map(c => c.trim())
    if (validCompanies.length === 0) {
      throw new Error('Please provide valid company names')
    }

    return this.request<CompetitorData[]>('/competitors/compare', {
      method: 'POST',
      body: JSON.stringify({ companies: validCompanies }),
    })
  }

  async exportData(companyName: string, format: 'pdf' | 'csv' | 'json' = 'json'): Promise<any> {
    if (!companyName || !companyName.trim()) {
      throw new Error('Company name is required')
    }

    if (!['pdf', 'csv', 'json'].includes(format)) {
      throw new Error('Invalid export format. Use pdf, csv, or json.')
    }

    if (format === 'json') {
      return this.request<any>(`/companies/${encodeURIComponent(companyName.trim())}/export?format=${format}`)
    } else {
      // For PDF and CSV, return blob
      const response = await fetch(`${this.baseUrl}/companies/${encodeURIComponent(companyName.trim())}/export?format=${format}`)
      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`)
      }
      return response.blob()
    }
  }

  async getCompanyBasicInfo(companyName: string): Promise<any> {
    if (!companyName || !companyName.trim()) {
      throw new Error('Company name is required')
    }

    return this.request<any>(`/companies/${encodeURIComponent(companyName.trim())}/basic-info`)
  }

  async getCompanyPosts(companyName: string, limit: number = 10): Promise<Post[]> {
    if (!companyName || !companyName.trim()) {
      throw new Error('Company name is required')
    }

    if (limit < 1 || limit > 50) {
      throw new Error('Limit must be between 1 and 50')
    }

    return this.request<Post[]>(`/companies/${encodeURIComponent(companyName.trim())}/posts?limit=${limit}`)
  }

  async getCompanyJobs(companyName: string, department?: string): Promise<JobPosting[]> {
    if (!companyName || !companyName.trim()) {
      throw new Error('Company name is required')
    }

    const params = new URLSearchParams()
    if (department && department.trim()) {
      params.append('department', department.trim())
    }

    const queryString = params.toString()
    const endpoint = `/companies/${encodeURIComponent(companyName.trim())}/jobs${queryString ? `?${queryString}` : ''}`

    return this.request<JobPosting[]>(endpoint)
  }

  // Health check endpoint
  async healthCheck(): Promise<{ status: string; service: string }> {
    return this.request<{ status: string; service: string }>('/health')
  }

  // Test connectivity
  async testConnection(): Promise<boolean> {
    try {
      await this.healthCheck()
      return true
    } catch {
      return false
    }
  }
}

export const apiClient = new ApiClient()

// Helper function to handle API calls with loading states
export async function withApiCall<T>(
  apiCall: () => Promise<T>,
  onLoading?: (loading: boolean) => void,
  onError?: (error: Error) => void
): Promise<ApiResponse<T>> {
  onLoading?.(true)
  
  try {
    const data = await apiCall()
    onLoading?.(false)
    return { data, error: null, loading: false }
  } catch (error) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      code: error instanceof Error ? error.name : 'UNKNOWN_ERROR',
    }
    
    onLoading?.(false)
    onError?.(error instanceof Error ? error : new Error('An unexpected error occurred'))
    
    return { data: null, error: apiError, loading: false }
  }
}

// Environment check helper
export function getApiConnectionStatus(): { isOnline: boolean; baseUrl: string } {
  return {
    isOnline: typeof window !== 'undefined' && navigator.onLine,
    baseUrl: API_BASE_URL,
  }
}
