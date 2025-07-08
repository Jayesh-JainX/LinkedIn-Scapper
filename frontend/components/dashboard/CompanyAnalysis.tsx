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
import {
  Building2,
  Users,
  MapPin,
  Calendar,
  TrendingUp,
  Briefcase,
  MessageSquare,
} from "lucide-react";

interface CompanyAnalysisProps {
  data: any;
}

export default function CompanyAnalysis({ data }: CompanyAnalysisProps) {
  // Mock data for demonstration
  const mockData = {
    name: "TechCorp Solutions",
    industry: "Software Development",
    size: "1,001-5,000 employees",
    headquarters: "San Francisco, CA",
    founded: "2010",
    recentPosts: [
      {
        id: "1",
        content:
          "Excited to announce our new AI research division! We're hiring top talent in machine learning and data science.",
        date: "2024-01-15",
        engagement: 245,
        type: "hiring",
      },
      {
        id: "2",
        content:
          "Grand opening of our new Austin office! Expanding our presence in Texas with a focus on cloud infrastructure.",
        date: "2024-01-12",
        engagement: 189,
        type: "expansion",
      },
      {
        id: "3",
        content:
          "Proud to announce our Q4 results - 40% growth in revenue and 25% increase in customer satisfaction.",
        date: "2024-01-10",
        engagement: 312,
        type: "milestone",
      },
    ],
    jobPostings: [
      {
        id: "1",
        title: "Senior Software Engineer",
        location: "San Francisco, CA",
        department: "Engineering",
        datePosted: "2024-01-14",
        requirements: ["React", "Node.js", "AWS", "5+ years experience"],
      },
      {
        id: "2",
        title: "Product Manager",
        location: "Remote",
        department: "Product",
        datePosted: "2024-01-13",
        requirements: [
          "Product strategy",
          "Agile",
          "Data analysis",
          "3+ years experience",
        ],
      },
      {
        id: "3",
        title: "Data Scientist",
        location: "Austin, TX",
        department: "AI Research",
        datePosted: "2024-01-12",
        requirements: [
          "Python",
          "Machine Learning",
          "Statistics",
          "PhD preferred",
        ],
      },
    ],
    keyMetrics: {
      totalEmployees: 3200,
      recentHires: 45,
      jobOpenings: 23,
      postEngagement: 248,
    },
  };

  const companyData = data || mockData;

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case "hiring":
        return "bg-blue-100 text-blue-800";
      case "expansion":
        return "bg-green-100 text-green-800";
      case "milestone":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Company Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="h-6 w-6 mr-2" />
            {companyData.name}
          </CardTitle>
          <CardDescription>Company Overview & Key Information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase className="h-4 w-4 mr-2" />
                Industry
              </div>
              <p className="font-medium">{companyData.industry}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                Company Size
              </div>
              <p className="font-medium">{companyData.size}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                Headquarters
              </div>
              <p className="font-medium">{companyData.headquarters}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Founded
              </div>
              <p className="font-medium">{companyData.founded}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Employees
                </p>
                <p className="text-2xl font-bold">
                  {companyData.keyMetrics.totalEmployees.toLocaleString()}
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
                  Recent Hires
                </p>
                <p className="text-2xl font-bold">
                  {companyData.keyMetrics.recentHires}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Job Openings
                </p>
                <p className="text-2xl font-bold">
                  {companyData.keyMetrics.jobOpenings}
                </p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg. Post Engagement
                </p>
                <p className="text-2xl font-bold">
                  {companyData.keyMetrics.postEngagement}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Company Posts</CardTitle>
          <CardDescription>
            Latest updates and announcements from the company
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {companyData.recentPosts.map((post: any) => (
              <div key={post.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getPostTypeColor(post.type)}>
                    {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                  </Badge>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-gray-800 mb-2">{post.content}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {post.engagement} engagements
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Job Postings */}
      <Card>
        <CardHeader>
          <CardTitle>Active Job Postings</CardTitle>
          <CardDescription>
            Current open positions and hiring trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Posted Date</TableHead>
                <TableHead>Key Requirements</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companyData.jobPostings.map((job: any) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.department}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    {new Date(job.datePosted).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {job.requirements
                        .slice(0, 3)
                        .map((req: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {req}
                          </Badge>
                        ))}
                      {job.requirements.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.requirements.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
