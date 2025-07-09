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
  Menu,
  X,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleExportData = () => {
    // TODO: Implement export functionality
    console.log("Exporting data...");
  };

  const handleRefresh = () => {
    // TODO: Implement refresh functionality
    setAnalysisProgress(0);
    setCompanyData(null);
    setActiveTab("collection");
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Mobile-first Container */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              Research Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Comprehensive LinkedIn intelligence platform
            </p>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex gap-2 lg:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              disabled={!companyData}
            >
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline">Export Data</span>
              <span className="lg:hidden">Export</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline">Refresh</span>
              <span className="lg:hidden">Refresh</span>
            </Button>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex sm:hidden gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleExportData}
              disabled={!companyData}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Analysis Progress - Mobile Optimized */}
        {isAnalyzing && (
          <Card className="mb-4 sm:mb-6">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Analysis in Progress
                </span>
                <span className="text-sm text-gray-500">
                  {analysisProgress}%
                </span>
              </div>
              <Progress value={analysisProgress} className="w-full" />
              <p className="text-xs text-gray-500 mt-2">
                Please wait while we analyze the company data...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs - Mobile Responsive */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile TabsList - Scrollable */}
          <div className="w-full overflow-x-auto">
            <TabsList className="grid grid-cols-4 w-full min-w-max sm:min-w-full">
              <TabsTrigger
                value="collection"
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 text-xs sm:text-sm"
              >
                <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Data</span>
                <span className="xs:hidden">Collect</span>
              </TabsTrigger>
              <TabsTrigger
                value="company"
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 text-xs sm:text-sm"
              >
                <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Company</span>
                <span className="xs:hidden">Co.</span>
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 text-xs sm:text-sm"
              >
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Insights</span>
                <span className="xs:hidden">Data</span>
              </TabsTrigger>
              <TabsTrigger
                value="competitors"
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 text-xs sm:text-sm"
              >
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Competitors</span>
                <span className="xs:hidden">Comp</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="collection"
            className="mt-4 sm:mt-6 space-y-4 sm:space-y-6"
          >
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

          <TabsContent
            value="company"
            className="mt-4 sm:mt-6 space-y-4 sm:space-y-6"
          >
            {companyData ? (
              <CompanyAnalysis data={companyData} />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Company Data
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Start by collecting company data to see analysis results.
                    </p>
                    <Button onClick={() => setActiveTab("collection")}>
                      <Search className="h-4 w-4 mr-2" />
                      Start Data Collection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent
            value="insights"
            className="mt-4 sm:mt-6 space-y-4 sm:space-y-6"
          >
            {companyData ? (
              <InsightsDashboard data={companyData} />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Insights Available
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Collect company data first to generate insights.
                    </p>
                    <Button onClick={() => setActiveTab("collection")}>
                      <Search className="h-4 w-4 mr-2" />
                      Start Data Collection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent
            value="competitors"
            className="mt-4 sm:mt-6 space-y-4 sm:space-y-6"
          >
            {companyData ? (
              <CompetitorComparison data={companyData} />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Competitor Data
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Analyze a company first to compare with competitors.
                    </p>
                    <Button onClick={() => setActiveTab("collection")}>
                      <Search className="h-4 w-4 mr-2" />
                      Start Data Collection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
