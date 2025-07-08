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
  // Mock data for comprehensive insights
  const mockInsights = {
    hiringTrends: [
      {
        department: "Engineering",
        count: 15,
        trend: "up",
        keyRoles: ["Senior Developer", "DevOps Engineer", "Tech Lead"],
      },
      {
        department: "Product",
        count: 8,
        trend: "up",
        keyRoles: ["Product Manager", "UX Designer", "Product Analyst"],
      },
      {
        department: "Sales",
        count: 12,
        trend: "stable",
        keyRoles: ["Account Executive", "Sales Development Rep"],
      },
      {
        department: "Marketing",
        count: 5,
        trend: "down",
        keyRoles: ["Content Manager", "Digital Marketer"],
      },
      {
        department: "Operations",
        count: 6,
        trend: "up",
        keyRoles: ["Operations Manager", "Business Analyst"],
      },
    ],
    leadershipChanges: [
      {
        name: "Sarah Chen",
        previousRole: "Senior Director",
        newRole: "VP of Engineering",
        date: "2024-01-10",
        type: "promotion",
      },
      {
        name: "Michael Rodriguez",
        previousRole: "External",
        newRole: "Chief Marketing Officer",
        date: "2024-01-08",
        type: "hire",
      },
      {
        name: "Jennifer Kim",
        previousRole: "Head of Sales",
        newRole: "External",
        date: "2024-01-05",
        type: "departure",
      },
    ],
    branchExpansions: [
      {
        location: "Austin, TX",
        date: "2024-01-15",
        type: "office",
        details: "New engineering hub focusing on cloud infrastructure",
      },
      {
        location: "Toronto, Canada",
        date: "2023-12-20",
        type: "office",
        details: "International expansion for North American market",
      },
      {
        location: "Denver, CO",
        date: "2023-12-10",
        type: "facility",
        details: "Customer support and operations center",
      },
    ],
    skillsTrends: [
      { skill: "React", demand: 85, growth: 12 },
      { skill: "Python", demand: 78, growth: 8 },
      { skill: "AWS", demand: 72, growth: 15 },
      { skill: "Machine Learning", demand: 65, growth: 25 },
      { skill: "DevOps", demand: 58, growth: 18 },
    ],
    departmentGrowth: [
      { name: "Engineering", value: 35, color: "#3b82f6" },
      { name: "Sales", value: 25, color: "#10b981" },
      { name: "Product", value: 20, color: "#8b5cf6" },
      { name: "Marketing", value: 12, color: "#f59e0b" },
      { name: "Operations", value: 8, color: "#ef4444" },
    ],
  };

  const insights = data?.insights || mockInsights;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case "down":
        return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
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
    <div className="space-y-6">
      {/* Key Insights Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Hiring Activity
                </p>
                <p className="text-2xl font-bold">
                  {insights.hiringTrends.reduce(
                    (sum: number, dept: any) => sum + dept.count,
                    0
                  )}
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +23% from last month
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Leadership Changes
                </p>
                <p className="text-2xl font-bold">
                  {insights.leadershipChanges.length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Last 30 days</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Branch Expansions
                </p>
                <p className="text-2xl font-bold">
                  {insights.branchExpansions.length}
                </p>
                <p className="text-sm text-gray-600 mt-1">Recent locations</p>
              </div>
              <Building2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hiring Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Hiring Trends by Department</CardTitle>
          <CardDescription>
            Current hiring activity and growth patterns across departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.hiringTrends.map((dept: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    {getTrendIcon(dept.trend)}
                    <span className="ml-2 font-medium">{dept.department}</span>
                  </div>
                  <Badge variant="outline">{dept.count} positions</Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Key Roles:</p>
                    <p className="text-sm">
                      {dept.keyRoles.slice(0, 2).join(", ")}
                    </p>
                  </div>
                  <div
                    className={`text-lg font-semibold ${getTrendColor(
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

      {/* Department Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Department Growth Distribution</CardTitle>
          <CardDescription>
            Hiring distribution across different departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={insights.departmentGrowth}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent || 0 * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {insights.departmentGrowth.map(
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

      {/* Leadership Changes */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Leadership Changes</CardTitle>
          <CardDescription>
            Executive and senior leadership movements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.leadershipChanges.map((change: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{change.name}</p>
                    <p className="text-sm text-gray-600">
                      {change.type === "promotion"
                        ? `Promoted from ${change.previousRole}`
                        : change.type === "hire"
                        ? `Hired as ${change.newRole}`
                        : `Left position as ${change.previousRole}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getChangeTypeColor(change.type)}>
                    {change.type.charAt(0).toUpperCase() + change.type.slice(1)}
                  </Badge>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(change.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Demand */}
      <Card>
        <CardHeader>
          <CardTitle>In-Demand Skills</CardTitle>
          <CardDescription>
            Most sought-after skills based on job postings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.skillsTrends.map((skill: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{skill.skill}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {skill.demand}% demand
                    </span>
                    <Badge variant="outline" className="text-green-600">
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

      {/* Branch Expansions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Branch Expansions</CardTitle>
          <CardDescription>
            New office locations and facility openings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.branchExpansions.map((expansion: any, index: number) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 border rounded-lg"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{expansion.location}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(expansion.date).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {expansion.details}
                  </p>
                  <Badge variant="outline">
                    {expansion.type.charAt(0).toUpperCase() +
                      expansion.type.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
