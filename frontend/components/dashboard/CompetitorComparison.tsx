"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Users,
  TrendingUp,
  Award,
  MapPin,
  Briefcase,
  MessageSquare,
  Plus,
  X,
  Search,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

interface CompetitorComparisonProps {
  data: any;
}

export default function CompetitorComparison({
  data,
}: CompetitorComparisonProps) {
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [newCompetitor, setNewCompetitor] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load competitors from data if available
    if (data?.insights?.competitor_comparison) {
      setCompetitors(data.insights.competitor_comparison);
    }
  }, [data]);

  const addCompetitor = async () => {
    if (!newCompetitor.trim()) {
      toast.error("Please enter a competitor name");
      return;
    }

    if (
      competitors.some(
        (comp) => comp.name.toLowerCase() === newCompetitor.toLowerCase()
      )
    ) {
      toast.error("Competitor already added");
      return;
    }

    setIsLoading(true);
    try {
      // Get comparison data from API
      const companyNames = [...competitors.map((c) => c.name), newCompetitor];
      const comparisonData = await apiClient.getCompetitorComparison(
        companyNames
      );

      setCompetitors(comparisonData);
      setNewCompetitor("");
      toast.success("Competitor added successfully");
    } catch (error) {
      console.error("Error adding competitor:", error);

      // Add with mock data if API fails
      const mockCompetitor = {
        name: newCompetitor,
        hiringActivity: Math.floor(Math.random() * 50) + 20,
        leadershipChanges: Math.floor(Math.random() * 5) + 1,
        marketActivity: Math.floor(Math.random() * 40) + 40,
        employeeCount: Math.floor(Math.random() * 3000) + 1000,
        recentExpansions: Math.floor(Math.random() * 3),
        socialEngagement: Math.floor(Math.random() * 200) + 100,
      };

      setCompetitors([...competitors, mockCompetitor]);
      setNewCompetitor("");
      toast.success("Competitor added (using sample data)");
    } finally {
      setIsLoading(false);
    }
  };

  const removeCompetitor = (competitorName: string) => {
    setCompetitors(competitors.filter((comp) => comp.name !== competitorName));
    toast.success("Competitor removed");
  };

  if (!data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Data Available
            </h3>
            <p className="text-gray-500">
              Please run a company analysis first to see competitor comparisons.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare radar chart data
  const radarData = competitors.map((comp: any) => ({
    company: comp.name.split(" ")[0], // Shortened name for chart
    hiring: comp.hiringActivity || 0,
    leadership: (comp.leadershipChanges || 0) * 10, // Scale for visibility
    market: comp.marketActivity || 0,
    engagement: (comp.socialEngagement || 0) / 3, // Scale down for chart
    expansion: (comp.recentExpansions || 0) * 20, // Scale for visibility
  }));

  // Prepare hiring comparison data
  const hiringData = competitors.map((comp: any) => ({
    name: comp.name.split(" ")[0],
    hiring: comp.hiringActivity || 0,
    employees: (comp.employeeCount || 0) / 100, // Scale for chart
  }));

  const getActivityLevel = (score: number) => {
    if (score >= 70)
      return { level: "High", color: "bg-green-100 text-green-800" };
    if (score >= 40)
      return { level: "Medium", color: "bg-yellow-100 text-yellow-800" };
    return { level: "Low", color: "bg-red-100 text-red-800" };
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Add Competitor Section - Mobile Responsive */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Add Competitors</CardTitle>
          <CardDescription>
            Add competitor companies to compare against your target company
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Enter competitor company name"
              value={newCompetitor}
              onChange={(e) => setNewCompetitor(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCompetitor()}
              className="flex-1"
            />
            <Button
              onClick={addCompetitor}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isLoading ? "Adding..." : "Add Competitor"}
            </Button>
          </div>

          {competitors.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {competitors.map((competitor) => (
                <Badge
                  key={competitor.name}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {competitor.name}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => removeCompetitor(competitor.name)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {competitors.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Competitors Added
              </h3>
              <p className="text-gray-500 mb-4">
                Add competitor companies to see comparison analysis
              </p>
              <Button onClick={() => document.querySelector("input")?.focus()}>
                <Search className="h-4 w-4 mr-2" />
                Add First Competitor
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Competitor Overview - Mobile Responsive */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Competitor Landscape Overview
              </CardTitle>
              <CardDescription>
                Comprehensive comparison of key competitors and market
                positioning
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Mobile View - Card Layout */}
              <div className="sm:hidden space-y-4">
                {competitors.map((competitor: any, index: number) => (
                  <Card key={index} className="border-2">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-base">
                            {competitor.name}
                          </h3>
                          <X
                            className="h-4 w-4 cursor-pointer text-gray-400 hover:text-red-500"
                            onClick={() => removeCompetitor(competitor.name)}
                          />
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Employees:</span>
                            <span className="font-medium">
                              {(competitor.employeeCount || 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Hiring Activity:</span>
                            <Badge
                              className={
                                getActivityLevel(competitor.hiringActivity || 0)
                                  .color
                              }
                              variant="secondary"
                            >
                              {
                                getActivityLevel(competitor.hiringActivity || 0)
                                  .level
                              }
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Market Activity:</span>
                            <span className="font-medium">
                              {competitor.marketActivity || 0}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Leadership Changes:</span>
                            <span className="font-medium">
                              {competitor.leadershipChanges || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop View - Grid Layout */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {competitors.map((competitor: any, index: number) => (
                  <Card key={index} className="border-2">
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">
                            {competitor.name}
                          </h3>
                          <X
                            className="h-4 w-4 cursor-pointer text-gray-400 hover:text-red-500"
                            onClick={() => removeCompetitor(competitor.name)}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Employees:</span>
                            <span className="font-medium">
                              {(competitor.employeeCount || 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Hiring Activity:</span>
                            <Badge
                              className={
                                getActivityLevel(competitor.hiringActivity || 0)
                                  .color
                              }
                              variant="secondary"
                            >
                              {
                                getActivityLevel(competitor.hiringActivity || 0)
                                  .level
                              }
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Market Activity:</span>
                            <span className="font-medium">
                              {competitor.marketActivity || 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Competitive Analysis Radar - Mobile Responsive */}
          {radarData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Competitive Analysis Radar
                </CardTitle>
                <CardDescription>
                  Multi-dimensional comparison across key business metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis
                        dataKey="company"
                        tick={{ fontSize: 12 }}
                      />
                      <PolarRadiusAxis tick={{ fontSize: 10 }} />
                      <Radar
                        name="Hiring"
                        dataKey="hiring"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="Market Activity"
                        dataKey="market"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.3}
                      />
                      <Tooltip />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hiring Activity Comparison - Mobile Responsive */}
          {hiringData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Hiring Activity Comparison
                </CardTitle>
                <CardDescription>
                  Current hiring trends across competitor companies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hiringData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar
                        dataKey="hiring"
                        fill="#3b82f6"
                        name="Hiring Activity"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Comparison Table - Mobile Responsive */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Detailed Metrics Comparison
              </CardTitle>
              <CardDescription>
                Side-by-side comparison of key performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Mobile View - Stacked Cards */}
              <div className="sm:hidden space-y-4">
                {competitors.map((competitor, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">{competitor.name}</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Employees</span>
                        <p className="font-medium">
                          {(competitor.employeeCount || 0).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Hiring Activity</span>
                        <p className="font-medium">
                          {competitor.hiringActivity || 0}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          Leadership Changes
                        </span>
                        <p className="font-medium">
                          {competitor.leadershipChanges || 0}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Market Activity</span>
                        <p className="font-medium">
                          {competitor.marketActivity || 0}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View - Table */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead>Hiring Activity</TableHead>
                      <TableHead>Leadership Changes</TableHead>
                      <TableHead>Market Activity</TableHead>
                      <TableHead>Social Engagement</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {competitors.map((competitor, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {competitor.name}
                        </TableCell>
                        <TableCell>
                          {(competitor.employeeCount || 0).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{competitor.hiringActivity || 0}</span>
                            <Progress
                              value={competitor.hiringActivity || 0}
                              className="w-16 h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          {competitor.leadershipChanges || 0}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              getActivityLevel(competitor.marketActivity || 0)
                                .color
                            }
                          >
                            {competitor.marketActivity || 0}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {competitor.socialEngagement || 0}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
