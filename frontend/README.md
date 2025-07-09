# 🎨 LinkedIn Research Tool - Frontend

A modern, mobile-first React application built with Next.js 14, providing an intuitive dashboard for LinkedIn company research and analysis.

## 🛠 Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern component library
- **Recharts** - Data visualization library
- **Lucide React** - Beautiful icons

## 📁 Project Structure

```
frontend/
├── app/                              # Next.js App Router
│   ├── dashboard/                    # Dashboard page
│   │   └── page.tsx                 # Main dashboard route
│   ├── layout.tsx                   # Root layout with metadata
│   ├── page.tsx                     # Landing page
│   └── globals.css                  # Global styles
├── components/                       # React Components
│   ├── dashboard/                   # Dashboard-specific components
│   │   ├── CompanyAnalysis.tsx      # Company data visualization
│   │   ├── DataCollection.tsx       # Data input and analysis form
│   │   ├── InsightsDashboard.tsx    # Analytics and insights display
│   │   └── CompetitorComparison.tsx # Competitor analysis component
│   └── ui/                          # Reusable UI components (Shadcn/ui)
│       ├── button.tsx               # Button component
│       ├── card.tsx                 # Card component
│       ├── input.tsx                # Input component
│       ├── table.tsx                # Table component
│       ├── tabs.tsx                 # Tabs component
│       └── ...                      # Other UI components
├── lib/                             # Utilities and configurations
│   ├── api.ts                       # API client and interfaces
│   └── utils.ts                     # Utility functions
├── hooks/                           # Custom React hooks
├── public/                          # Static assets
├── .env.local                       # Environment variables
├── next.config.ts                   # Next.js configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:8000`

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Create environment file:**
   Create `.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=LinkedIn Research Tool
NEXT_PUBLIC_APP_VERSION=1.0.0
```

3. **Start development server:**

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 🧩 Key Components

### Dashboard Components

#### `DataCollection.tsx`

- **Purpose**: Company data input and analysis initiation
- **Features**:
  - Company name input with validation
  - Real-time analysis progress tracking
  - Error handling and user feedback
- **Props**:
  - `onAnalysisStart`: Callback when analysis begins
  - `onAnalysisComplete`: Callback with analysis results
  - `onProgressUpdate`: Progress update callback

#### `CompanyAnalysis.tsx`

- **Purpose**: Display comprehensive company information
- **Features**:
  - Company overview with key metrics
  - Employee data visualization
  - Job postings and recent posts
  - Mobile-responsive design
- **Props**:
  - `data`: Company analysis data object

#### `InsightsDashboard.tsx`

- **Purpose**: AI-generated insights and analytics
- **Features**:
  - Hiring trends analysis
  - Leadership changes tracking
  - Branch expansion detection
  - Engagement metrics
- **Props**:
  - `companyName`: Target company name
  - `data`: Analysis data for insight generation

#### `CompetitorComparison.tsx`

- **Purpose**: Multi-company comparison analysis
- **Features**:
  - Dynamic competitor addition/removal
  - Side-by-side metrics comparison
  - Market positioning analysis
  - Export comparison data
- **Props**:
  - `initialCompanies`: Optional initial company list

### UI Components (Shadcn/ui)

All UI components follow the Shadcn/ui design system:

- **Consistent design language**
- **Accessibility-first approach**
- **Dark mode support ready**
- **Mobile-responsive by default**

## 🔌 API Integration

### API Client (`lib/api.ts`)

The API client provides:

- **Type-safe interfaces** for all data structures
- **Comprehensive error handling** with user-friendly messages
- **Request timeout management** (30-second timeout)
- **Loading state helpers** for React components
- **Environment-based configuration**

### Key Interfaces

```typescript
interface CompanyData {
  name: string;
  industry: string;
  size: string;
  headquarters: string;
  recentPosts: Post[];
  jobPostings: JobPosting[];
  employees: Employee[];
}

interface InsightData {
  hiringTrends: HiringTrend[];
  leadershipChanges: LeadershipChange[];
  branchExpansions: BranchExpansion[];
  competitorComparison: CompetitorData[];
}
```

### API Methods

```typescript
// Analyze company
await api.analyzeCompany(companyName, competitors);

// Get insights
await api.getInsights(companyName);

// Compare competitors
await api.getCompetitorComparison(companies);

// Export data
await api.exportData(companyName, format);
```

## 📱 Mobile-First Design

### Responsive Breakpoints

- **Mobile**: `< 640px` - Single column layout, stacked cards
- **Tablet**: `640px - 1024px` - Two-column grid, condensed navigation
- **Desktop**: `> 1024px` - Full multi-column layout

### Mobile Optimizations

- **Touch-friendly targets** (min 44px)
- **Scrollable tab navigation** for narrow screens
- **Collapsible content** to reduce scroll
- **Optimized font sizes** for readability
- **Fast loading** with progressive enhancement

## 🎨 Styling Guidelines

### Tailwind CSS Classes

```css
/* Mobile-first responsive grid */
grid-cols-1 sm:grid-cols-2 lg:grid-cols-4

/* Responsive text sizes */
text-sm sm:text-base lg:text-lg

/* Mobile-optimized spacing */
p-3 sm:p-4 lg:p-6

/* Touch-friendly buttons */
min-h-[44px] px-4 py-2
```

### Component Patterns

- **Cards**: Use for content grouping and elevation
- **Tables → Cards**: Transform tables to cards on mobile
- **Progressive disclosure**: Show details on demand
- **Loading states**: Always provide feedback

## 🔍 Development Best Practices

### TypeScript

- **Strict mode enabled** for type safety
- **Interface definitions** for all API responses
- **Proper typing** for component props
- **Generic types** for reusable components

### Performance

- **Code splitting** with dynamic imports
- **Image optimization** with Next.js Image
- **API response caching** where appropriate
- **Lazy loading** for heavy components

### Error Handling

```typescript
// Component-level error boundaries
try {
  const data = await api.analyzeCompany(name);
  setCompanyData(data);
} catch (error) {
  toast.error(error.message);
  setError(error.message);
}
```

### State Management

- **React state** for component-level data
- **Props drilling** avoided with composition
- **Context API** for shared application state
- **Custom hooks** for reusable logic

## 🧪 Testing

### Testing Strategy

- **Unit tests** for utility functions
- **Component tests** with React Testing Library
- **Integration tests** for API interactions
- **E2E tests** for critical user flows

### Running Tests

```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 🚀 Production Build

### Build Optimization

```bash
npm run build
```

This creates an optimized production build with:

- **Static optimization** for faster loading
- **Code splitting** for efficient caching
- **Asset optimization** (images, CSS, JS)
- **Bundle analysis** available

### Environment Variables

```env
# Production environment
NEXT_PUBLIC_API_URL=https://api.yourcompany.com
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=LinkedIn Research Tool
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 🐛 Troubleshooting

### Common Issues

**Build fails:**

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**

```bash
# Run type checking
npm run type-check

# Fix auto-fixable issues
npm run lint --fix
```

**Styling issues:**

- Check Tailwind CSS configuration
- Verify component class names
- Test responsive breakpoints

**API connection problems:**

- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check backend server is running
- Inspect network requests in browser DevTools

## 🤝 Contributing

### Development Workflow

1. Create feature branch from `main`
2. Implement changes with proper TypeScript typing
3. Add/update tests for new functionality
4. Ensure responsive design works on all devices
5. Run linting and type checking
6. Submit pull request with clear description

### Code Style

- **ESLint** and **Prettier** for consistent formatting
- **Semantic commit messages**
- **Component documentation** with JSDoc
- **Accessibility compliance** (WCAG 2.1)

---

**Frontend built with modern React patterns and mobile-first design principles.**
