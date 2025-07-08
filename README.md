# LinkedIn Research Tool

A comprehensive AI-powered LinkedIn research and analysis platform built with Next.js frontend and Python FastAPI backend.

## Features

- **Company Analysis**: Deep dive into company profiles, recent posts, and organizational changes
- **Employee Insights**: Track leadership changes, hiring patterns, and employee achievements
- **Competitive Intelligence**: Compare companies and identify market trends and opportunities
- **Data Collection**: Automated LinkedIn data scraping and processing
- **Interactive Dashboard**: Modern UI with real-time insights and visualizations

## Tech Stack

### Frontend

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Shadcn/ui components
- Recharts for data visualization

### Backend

- Python FastAPI
- Pydantic for data validation
- Async/await for performance
- RESTful API design

## Project Structure

```
linkedin-research-tool/
├── frontend/ # Next.js frontend application
│ ├── app/ # App router pages
│ ├── components/ # React components
│ ├── lib/ # Utility functions
│ └── ...
├── backend/ # Python FastAPI backend
│ ├── app/ # Main application
│ │ ├── api/ # API endpoints
│ │ ├── models/ # Data models
│ │ ├── services/ # Business logic
│ │ └── utils/ # Helper functions
│ └── ...
└── README.md
```

## Installation & Setup

### Frontend Setup

1. Navigate to frontend directory:

```
cd frontend
```

2. Install dependencies:

```
npm install
```

3. Start the development server:

```
npm run dev
```

### Backend Setup

1. Navigate to backend directory:

```
cd backend
```

2. Create a virtual environment (optional but recommended):

```
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:

```
pip install -r requirements.txt
```
