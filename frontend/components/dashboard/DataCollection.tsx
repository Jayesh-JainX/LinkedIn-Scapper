"use client";

import { useState } from "react";
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
  Search,
  Plus,
  X,
  Play,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  Building2,
  Users,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

interface DataCollectionProps {
  onAnalysisStart: () => void;
  onAnalysisComplete: (data: any) => void;
  onProgressUpdate: (progress: number) => void;
}

export default function DataCollection({
  onAnalysisStart,
  onAnalysisComplete,
  onProgressUpdate,
}: DataCollectionProps) {
  const [companyName, setCompanyName] = useState("");
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [newCompetitor, setNewCompetitor] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [collectionParams, setCollectionParams] = useState({
    includeEmployees: true,
    includePosts: true,
    includeJobs: true,
    maxEmployees: 100,
    daysBack: 30,
  });

  const addCompetitor = () => {
    if (newCompetitor.trim() && !competitors.includes(newCompetitor.trim())) {
      setCompetitors([...competitors, newCompetitor.trim()]);
      setNewCompetitor("");
    }
  };

  const removeCompetitor = (competitor: string) => {
    setCompetitors(competitors.filter((c) => c !== competitor));
  };

  const startAnalysis = async () => {
    if (!companyName.trim()) {
      toast.error("Please enter a company name");
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setAnalysisResults(null);
    onAnalysisStart();
    setAnalysisStatus("Initializing analysis...");

    try {
      // Start company analysis
      setProgress(20);
      onProgressUpdate(20);
      setAnalysisStatus("Collecting company data...");

      const analysisData = await apiClient.analyzeCompany(
        companyName,
        competitors
      );
      setProgress(60);
      onProgressUpdate(60);
      setAnalysisStatus("Generating insights...");

      // Get insights after company analysis
      const insightData = await apiClient.getInsights(companyName);
      setProgress(90);
      onProgressUpdate(90);

      // Combine analysis and insight data
      const combinedData = {
        ...analysisData,
        insights: insightData,
      };

      setProgress(100);
      onProgressUpdate(100);
      setAnalysisStatus("Analysis complete!");
      setAnalysisResults(combinedData);
      onAnalysisComplete(combinedData);
      toast.success("Analysis completed successfully!");
    } catch (error) {
      console.error("Analysis failed:", error);
      let errorMessage =
        error instanceof Error
          ? error.message
          : "Analysis failed. Please try again.";
      setAnalysisStatus(errorMessage);
      toast.error(errorMessage);
      setProgress(0);
      onProgressUpdate(0);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Company Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Target Company
          </CardTitle>
          <CardDescription>
            Enter the primary company you want to research
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Company name (e.g., Microsoft, Google, Apple)"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={startAnalysis}
              disabled={!companyName.trim() || isAnalyzing}
              className="px-8"
            >
              {isAnalyzing ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Analysis
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Competitors */}
      <Card>
        <CardHeader>
          <CardTitle>Competitor Companies</CardTitle>
          <CardDescription>
            Add competitor companies for comparative analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add competitor company"
                value={newCompetitor}
                onChange={(e) => setNewCompetitor(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCompetitor()}
                className="flex-1"
              />
              <Button onClick={addCompetitor} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {competitors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {competitors.map((competitor) => (
                  <Badge
                    key={competitor}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {competitor}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-500"
                      onClick={() => removeCompetitor(competitor)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Collection Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Collection Parameters
          </CardTitle>
          <CardDescription>
            Customize what data to collect and analyze
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Data Types</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={collectionParams.includeEmployees}
                    onChange={(e) =>
                      setCollectionParams({
                        ...collectionParams,
                        includeEmployees: e.target.checked,
                      })
                    }
                  />
                  <span>Employee Profiles</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={collectionParams.includePosts}
                    onChange={(e) =>
                      setCollectionParams({
                        ...collectionParams,
                        includePosts: e.target.checked,
                      })
                    }
                  />
                  <span>Company Posts</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={collectionParams.includeJobs}
                    onChange={(e) =>
                      setCollectionParams({
                        ...collectionParams,
                        includeJobs: e.target.checked,
                      })
                    }
                  />
                  <span>Job Postings</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Collection Limits</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Max Employees to Analyze
                  </label>
                  <Input
                    type="number"
                    value={collectionParams.maxEmployees}
                    onChange={(e) =>
                      setCollectionParams({
                        ...collectionParams,
                        maxEmployees: parseInt(e.target.value) || 100,
                      })
                    }
                    min="10"
                    max="500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Days Back for Posts
                  </label>
                  <Input
                    type="number"
                    value={collectionParams.daysBack}
                    onChange={(e) =>
                      setCollectionParams({
                        ...collectionParams,
                        daysBack: parseInt(e.target.value) || 30,
                      })
                    }
                    min="7"
                    max="90"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Status */}
      {isAnalyzing && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 animate-spin text-blue-600" />
                <span className="font-medium">Analysis in Progress</span>
              </div>
              <Badge variant="secondary">Processing</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">{analysisStatus}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Company: {companyName}</span>
                <span>Competitors: {competitors.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Target Company
                </p>
                <p className="text-2xl font-bold">{companyName || "Not set"}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Competitors</p>
                <p className="text-2xl font-bold">{competitors.length}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-lg font-semibold">
                  {isAnalyzing ? "Analyzing" : "Ready"}
                </p>
              </div>
              {isAnalyzing ? (
                <Clock className="h-8 w-8 text-orange-600 animate-spin" />
              ) : (
                <CheckCircle className="h-8 w-8 text-green-600" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
