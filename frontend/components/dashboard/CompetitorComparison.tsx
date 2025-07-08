"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface CompetitorComparisonProps {
  data: any;
}

export default function CompetitorComparison({
  data,
}: CompetitorComparisonProps) {
  // Mock competitor data
  const mockCompetitors = [
    {
      name: "TechCorp Solutions",
      hiringActivity: 46,
      leadershipChanges: 3,
      marketActivity: 78,
      employeeCount: 3200,
      recentExpansions: 2,
      socialEngagement: 248,
      keyStrengths: ["AI/ML", "Cloud Infrastructure", "Enterprise Solutions"],
      recentMilestones: [
        "Austin office opening",
        "Q4 40% growth",
        "AI division launch",
      ],
    },
    {
      name: "InnovateX",
      hiringActivity: 32,
      leadershipChanges: 1,
      marketActivity: 65,
      employeeCount: 2800,
      recentExpansions: 1,
      socialEngagement: 189,
      keyStrengths: [
        "Mobile Development",
        "UX/UI Design",
        "Startup Partnerships",
      ],
      recentMilestones: [
        "Series C funding",
        "Mobile app launch",
        "Design team expansion",
      ],
    },
    {
      name: "DataFlow Systems",
      hiringActivity: 28,
      leadershipChanges: 2,
      marketActivity: 72,
      employeeCount: 1900,
      recentExpansions: 0,
      socialEngagement: 156,
      keyStrengths: ["Data Analytics", "Business Intelligence", "Consulting"],
      recentMilestones: [
        "Partnership with Microsoft",
        "Analytics platform update",
        "Client base growth",
      ],
    },
    {
      name: "CloudTech Pro",
      hiringActivity: 38,
      leadershipChanges: 4,
      marketActivity: 69,
      employeeCount: 2400,
      recentExpansions: 3,
      socialEngagement: 203,
      keyStrengths: ["Cloud Migration", "DevOps", "Security Solutions"],
      recentMilestones: [
        "European expansion",
        "Security certification",
        "DevOps tool launch",
      ],
    },
  ];

  const competitors = data?.competitors || mockCompetitors;

  // Prepare radar chart data
  const radarData = competitors.map((comp: any) => ({
    company: comp.name.split(" ")[0], // Shortened name for chart
    hiring: comp.hiringActivity,
    leadership: comp.leadershipChanges * 10, // Scale for visibility
    market: comp.marketActivity,
    engagement: comp.socialEngagement / 3, // Scale down for chart
    expansion: comp.recentExpansions * 20, // Scale for visibility
  }));

  // Prepare hiring comparison data
  const hiringData = competitors.map((comp: any) => ({
    name: comp.name.split(" ")[0],
    hiring: comp.hiringActivity,
    employees: comp.employeeCount / 100, // Scale for chart
  }));

  const getActivityLevel = (score: number) => {
    if (score >= 70)
      return { level: "High", color: "bg-green-100 text-green-800" };
    if (score >= 40)
      return { level: "Medium", color: "bg-yellow-100 text-yellow-800" };
    return { level: "Low", color: "bg-red-100 text-red-800" };
  };

  return (
    <div className="space-y-6">
      {/* Competitor Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Competitor Landscape Overview</CardTitle>
          <CardDescription>
            Comprehensive comparison of key competitors and market positioning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {competitors.map((competitor: any, index: number) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-4">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">
                      {competitor.name}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Employees:</span>
                        <span className="font-medium">
                          {competitor.employeeCount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Hiring Activity:</span>
                        <Badge
                          className={
                            getActivityLevel(competitor.hiringActivity).color
                          }
                        >
                          {getActivityLevel(competitor.hiringActivity).level}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Market Activity:</span>
                        <span className="font-medium">
                          {competitor.marketActivity}%
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

      {/* Competitive Analysis Radar */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Dimensional Competitive Analysis</CardTitle>
          <CardDescription>
            Radar chart comparing key performance indicators across competitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="company" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Hiring Activity"
                  dataKey="hiring"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                />
                <Radar
                  name="Market Activity"
                  dataKey="market"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.1}
                />
                <Radar
                  name="Social Engagement"
                  dataKey="engagement"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.1}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Hiring Activity Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Hiring Activity Comparison</CardTitle>
          <CardDescription>
            Current hiring trends and employee growth across competitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hiringData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hiring" fill="#3b82f6" name="Active Hiring" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Competitive Metrics</CardTitle>
          <CardDescription>
            Comprehensive comparison of key business indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Hiring Activity</TableHead>
                <TableHead>Leadership Changes</TableHead>
                <TableHead>Expansions</TableHead>
                <TableHead>Social Engagement</TableHead>
                <TableHead>Market Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitors.map((competitor: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {competitor.name}
                  </TableCell>
                  <TableCell>
                    {competitor.employeeCount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress
                        value={competitor.hiringActivity}
                        className="w-16 h-2"
                      />
                      <span className="text-sm">
                        {competitor.hiringActivity}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {competitor.leadershipChanges}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {competitor.recentExpansions}
                    </Badge>
                  </TableCell>
                  <TableCell>{competitor.socialEngagement}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress
                        value={competitor.marketActivity}
                        className="w-16 h-2"
                      />
                      <span className="text-sm">
                        {competitor.marketActivity}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Key Strengths & Recent Milestones */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Strengths by Competitor</CardTitle>
            <CardDescription>
              Core competencies and market positioning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competitors.map((competitor: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{competitor.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {competitor.keyStrengths.map(
                      (strength: string, strengthIndex: number) => (
                        <Badge key={strengthIndex} variant="secondary">
                          {strength}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Milestones</CardTitle>
            <CardDescription>
              Latest achievements and significant developments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competitors.map((competitor: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{competitor.name}</h3>
                  <ul className="space-y-1">
                    {competitor.recentMilestones.map(
                      (milestone: string, milestoneIndex: number) => (
                        <li
                          key={milestoneIndex}
                          className="text-sm text-gray-600 flex items-center"
                        >
                          <Award className="h-3 w-3 mr-2 text-blue-600" />
                          {milestone}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Position Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Market Position Analysis</CardTitle>
          <CardDescription>
            Strategic positioning and competitive advantages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Market Leaders</h3>
              <div className="space-y-2">
                {competitors
                  .sort((a: any, b: any) => b.marketActivity - a.marketActivity)
                  .slice(0, 2)
                  .map((competitor: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-medium">{competitor.name}</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {competitor.marketActivity}% activity
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Fastest Growing</h3>
              <div className="space-y-2">
                {competitors
                  .sort((a: any, b: any) => b.hiringActivity - a.hiringActivity)
                  .slice(0, 2)
                  .map((competitor: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-medium">{competitor.name}</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {competitor.hiringActivity} hires
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
