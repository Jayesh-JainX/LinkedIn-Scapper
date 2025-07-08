"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Users,
  TrendingUp,
  Search,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import CompanyAnalysis from "@/components/dashboard/CompanyAnalysis";
import InsightsDashboard from "@/components/dashboard/InsightsDashboard";
import DataCollection from "@/components/dashboard/DataCollection";
import CompetitorComparison from "@/components/dashboard/CompetitorComparison";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("collection");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [companyData, setCompanyData] = useState(null);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Research Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive LinkedIn intelligence platform
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Analysis in Progress</span>
              <span className="text-sm text-gray-500">{analysisProgress}%</span>
            </div>
            <Progress value={analysisProgress} className="w-full" />
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="collection" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Data Collection
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Company Analysis
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="competitors" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Competitors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collection" className="mt-6">
          <DataCollection
            onAnalysisStart={() => setIsAnalyzing(true)}
            onAnalysisComplete={(data) => {
              setIsAnalyzing(false);
              setCompanyData(data);
              setActiveTab("company");
            }}
            onProgressUpdate={setAnalysisProgress}
          />
        </TabsContent>

        <TabsContent value="company" className="mt-6">
          <CompanyAnalysis data={companyData} />
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <InsightsDashboard data={companyData} />
        </TabsContent>

        <TabsContent value="competitors" className="mt-6">
          <CompetitorComparison data={companyData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
