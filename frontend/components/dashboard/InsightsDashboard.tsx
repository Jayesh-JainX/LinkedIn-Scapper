"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  MapPin,
  Calendar,
  Award,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface InsightsDashboardProps {
  data: any;
}

export default function InsightsDashboard({ data }: InsightsDashboardProps) {
  if (!data || !data.insights) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Insights Available
            </h3>
            <p className="text-gray-500">
              Run a company analysis first to generate insights and trends.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const insights = data.insights;

  // Generate insights from the actual data
  const generatedInsights = {
    hiringTrends: generateHiringTrends(data),
    leadershipChanges: generateLeadershipChanges(data),
    branchExpansions: generateBranchExpansions(data),
    skillsTrends: generateSkillsTrends(data),
    departmentGrowth: generateDepartmentGrowth(data),
  };

  const finalInsights = {
    ...generatedInsights,
    ...insights, // API insights override generated ones
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return (
          <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
        );
      case "down":
        return (
          <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
        );
      default:
        return <Minus className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case "hire":
        return "bg-green-100 text-green-800";
      case "promotion":
        return "bg-blue-100 text-blue-800";
      case "departure":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Key Insights Summary - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Hiring Activity
                </p>
                <p className="text-lg sm:text-2xl font-bold">
                  {finalInsights.hiringTrends?.reduce(
                    (sum: number, dept: any) => sum + (dept.count || 0),
                    0
                  ) || 0}
                </p>
                <p className="text-xs sm:text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Active hiring
                </p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Leadership Changes
                </p>
                <p className="text-lg sm:text-2xl font-bold">
                  {finalInsights.leadershipChanges?.length || 0}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Recent activity
                </p>
              </div>
              <Award className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Branch Expansions
                </p>
                <p className="text-lg sm:text-2xl font-bold">
                  {finalInsights.branchExpansions?.length || 0}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  New locations
                </p>
              </div>
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hiring Trends - Mobile Responsive */}
      {finalInsights.hiringTrends && finalInsights.hiringTrends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Hiring Trends by Department
            </CardTitle>
            <CardDescription>
              Current hiring activity and growth patterns across departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {finalInsights.hiringTrends.map((dept: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg gap-3"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex items-center">
                      {getTrendIcon(dept.trend)}
                      <span className="ml-2 font-medium text-sm sm:text-base">
                        {dept.department}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {dept.count} positions
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between sm:space-x-4">
                    <div className="flex-1 sm:text-right">
                      <p className="text-xs sm:text-sm text-gray-600">
                        Key Roles:
                      </p>
                      <p className="text-xs sm:text-sm">
                        {dept.keyRoles?.slice(0, 2).join(", ") ||
                          "Various positions"}
                      </p>
                    </div>
                    <div
                      className={`text-base sm:text-lg font-semibold ${getTrendColor(
                        dept.trend
                      )}`}
                    >
                      {dept.trend === "up"
                        ? "↗"
                        : dept.trend === "down"
                        ? "↘"
                        : "→"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Department Growth Chart - Mobile Responsive */}
      {finalInsights.departmentGrowth &&
        finalInsights.departmentGrowth.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Department Growth Distribution
              </CardTitle>
              <CardDescription>
                Hiring distribution across different departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={finalInsights.departmentGrowth}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${((percent || 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {finalInsights.departmentGrowth.map(
                        (entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Leadership Changes - Mobile Responsive */}
      {finalInsights.leadershipChanges &&
        finalInsights.leadershipChanges.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Recent Leadership Changes
              </CardTitle>
              <CardDescription>
                Executive and senior leadership movements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {finalInsights.leadershipChanges.map(
                  (change: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg gap-3"
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm sm:text-base">
                            {change.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {change.type === "promotion"
                              ? `Promoted from ${change.previousRole}`
                              : change.type === "hire"
                              ? `Hired as ${change.newRole}`
                              : `Left position as ${change.previousRole}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:space-x-3">
                        <Badge
                          className={getChangeTypeColor(change.type)}
                          variant="secondary"
                        >
                          {change.type.charAt(0).toUpperCase() +
                            change.type.slice(1)}
                        </Badge>
                        <div className="text-xs sm:text-sm text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {new Date(change.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Skills Demand - Mobile Responsive */}
      {finalInsights.skillsTrends && finalInsights.skillsTrends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              In-Demand Skills
            </CardTitle>
            <CardDescription>
              Most sought-after skills based on job postings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {finalInsights.skillsTrends
                .slice(0, 8)
                .map((skill: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <span className="font-medium text-sm sm:text-base">
                        {skill.skill}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs sm:text-sm text-gray-600">
                          {skill.demand}% demand
                        </span>
                        <Badge
                          variant="outline"
                          className="text-green-600 text-xs"
                        >
                          +{skill.growth}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={skill.demand} className="h-2" />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Branch Expansions - Mobile Responsive */}
      {finalInsights.branchExpansions &&
        finalInsights.branchExpansions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Recent Branch Expansions
              </CardTitle>
              <CardDescription>
                New office locations and facility openings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {finalInsights.branchExpansions.map(
                  (expansion: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 border rounded-lg"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                          <h3 className="font-medium text-sm sm:text-base">
                            {expansion.location}
                          </h3>
                          <div className="flex items-center text-xs sm:text-sm text-gray-500">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {new Date(expansion.date).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">
                          {expansion.details}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {expansion.type.charAt(0).toUpperCase() +
                            expansion.type.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}

// Helper functions to generate insights from data
function generateHiringTrends(data: any) {
  if (!data.jobPostings || data.jobPostings.length === 0) return [];

  const deptCounts: Record<string, any> = {};

  data.jobPostings.forEach((job: any) => {
    if (!deptCounts[job.department]) {
      deptCounts[job.department] = {
        department: job.department,
        count: 0,
        keyRoles: new Set(),
        trend: "up" as const,
      };
    }
    deptCounts[job.department].count++;
    deptCounts[job.department].keyRoles.add(job.title);
  });

  return Object.values(deptCounts).map((dept: any) => ({
    ...dept,
    keyRoles: Array.from(dept.keyRoles).slice(0, 3),
  }));
}

function generateLeadershipChanges(data: any) {
  // Mock leadership changes based on employee data
  if (!data.employees || data.employees.length === 0) return [];

  const seniorEmployees = data.employees.filter(
    (emp: any) =>
      emp.title &&
      (emp.title.toLowerCase().includes("manager") ||
        emp.title.toLowerCase().includes("director") ||
        emp.title.toLowerCase().includes("vp") ||
        emp.title.toLowerCase().includes("chief"))
  );

  return seniorEmployees.slice(0, 3).map((emp: any, index: number) => ({
    name: emp.name,
    previousRole: index === 0 ? "Senior Manager" : null,
    newRole: emp.title,
    date: new Date(Date.now() - index * 10 * 24 * 60 * 60 * 1000).toISOString(),
    type: index === 0 ? "promotion" : "hire",
  }));
}

function generateBranchExpansions(data: any) {
  if (!data.recentPosts || data.recentPosts.length === 0) return [];

  const expansionPosts = data.recentPosts.filter(
    (post: any) =>
      post.type === "expansion" ||
      post.content.toLowerCase().includes("office") ||
      post.content.toLowerCase().includes("location")
  );

  return expansionPosts.slice(0, 2).map((post: any) => ({
    location: "New Location",
    date: post.date,
    type: "office",
    details: post.content.substring(0, 100) + "...",
  }));
}

function generateSkillsTrends(data: any) {
  if (!data.jobPostings || data.jobPostings.length === 0) return [];

  const skillCounts: Record<string, number> = {};

  data.jobPostings.forEach((job: any) => {
    job.requirements?.forEach((skill: string) => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });

  return Object.entries(skillCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([skill, count]) => ({
      skill,
      demand: Math.min(
        100,
        Math.round((count / data.jobPostings.length) * 100)
      ),
      growth: Math.floor(Math.random() * 20) + 5, // Mock growth
    }));
}

function generateDepartmentGrowth(data: any) {
  if (!data.jobPostings || data.jobPostings.length === 0) return [];

  const deptCounts: Record<string, number> = {};
  const colors = [
    "#3b82f6",
    "#10b981",
    "#8b5cf6",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
  ];

  data.jobPostings.forEach((job: any) => {
    deptCounts[job.department] = (deptCounts[job.department] || 0) + 1;
  });

  return Object.entries(deptCounts).map(([name, value], index) => ({
    name,
    value,
    color: colors[index % colors.length],
  }));
}
