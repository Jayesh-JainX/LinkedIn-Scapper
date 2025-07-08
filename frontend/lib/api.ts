const API_BASE_URL = 'http://localhost:8000/api'

export interface CompanyData {
  name: string
  industry: string
  size: string
  headquarters: string
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
}

export interface HiringTrend {
  department: string
  count: number
  trend: 'up' | 'down' | 'stable'
  keyRoles: string[]
}

export interface LeadershipChange {
  name: string
  previousRole: string
  newRole: string
  date: string
  type: 'hire' | 'promotion' | 'departure'
}

export interface BranchExpansion {
  location: string
  date: string
  type: 'office' | 'branch' | 'facility'
  details: string
}

export interface CompetitorData {
  name: string
  hiringActivity: number
  leadershipChanges: number
  marketActivity: number
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API error responses with detailed messages
        const errorMessage = data.detail || data.message || response.statusText;
        throw new Error(`API Error (${response.status}): ${errorMessage}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        // Re-throw API errors
        throw error;
      }
      // Handle network or parsing errors
      throw new Error('Failed to connect to the API. Please check your connection and try again.');
    }
  }

  async analyzeCompany(companyName: string, competitors: string[] = []): Promise<CompanyData> {
    return this.request<CompanyData>('/companies/analyze', {
      method: 'POST',
      body: JSON.stringify({ company_name: companyName, competitors }),
    })
  }

  async getInsights(companyName: string): Promise<InsightData> {
    return this.request<InsightData>(`/insights/${encodeURIComponent(companyName)}`)
  }

  async getCompetitorComparison(companies: string[]): Promise<CompetitorData[]> {
    return this.request<CompetitorData[]>('/competitors/compare', {
      method: 'POST',
      body: JSON.stringify({ companies }),
    })
  }

  async exportData(companyName: string, format: 'pdf' | 'csv' | 'json'): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/export/${encodeURIComponent(companyName)}?format=${format}`)
    return response.blob()
  }
}

export const apiClient = new ApiClient()
