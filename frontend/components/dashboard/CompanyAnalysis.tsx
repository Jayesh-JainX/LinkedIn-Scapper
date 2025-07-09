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
  if (!data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Company Data Available
            </h3>
            <p className="text-gray-500">
              Please run an analysis first to see company information.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

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

  // Calculate key metrics from the data
  const keyMetrics = {
    totalEmployees: data.employees?.length || 0,
    recentHires:
      data.employees?.filter(
        (emp: any) =>
          emp.tenure &&
          (emp.tenure.includes("months") || emp.tenure.includes("1 year"))
      ).length || 0,
    jobOpenings: data.jobPostings?.length || 0,
    postEngagement:
      data.recentPosts?.length > 0
        ? Math.round(
            data.recentPosts.reduce(
              (sum: number, post: any) => sum + (post.engagement || 0),
              0
            ) / data.recentPosts.length
          )
        : 0,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Company Overview - Mobile Responsive */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg sm:text-xl">
            <Building2 className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
            {data.name}
          </CardTitle>
          <CardDescription>Company Overview & Key Information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase className="h-4 w-4 mr-2" />
                Industry
              </div>
              <p className="font-medium text-sm sm:text-base">
                {data.industry || "Not available"}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                Company Size
              </div>
              <p className="font-medium text-sm sm:text-base">
                {data.size || "Not available"}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                Headquarters
              </div>
              <p className="font-medium text-sm sm:text-base">
                {data.headquarters || "Not available"}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Founded
              </div>
              <p className="font-medium text-sm sm:text-base">
                {data.founded || "Not available"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics - Mobile Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Employees
                </p>
                <p className="text-lg sm:text-2xl font-bold">
                  {keyMetrics.totalEmployees.toLocaleString()}
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
                  Recent Hires
                </p>
                <p className="text-lg sm:text-2xl font-bold">
                  {keyMetrics.recentHires}
                </p>
              </div>
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Job Openings
                </p>
                <p className="text-lg sm:text-2xl font-bold">
                  {keyMetrics.jobOpenings}
                </p>
              </div>
              <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Avg. Engagement
                </p>
                <p className="text-lg sm:text-2xl font-bold">
                  {keyMetrics.postEngagement}
                </p>
              </div>
              <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts - Mobile Responsive */}
      {data.recentPosts && data.recentPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Recent Company Posts
            </CardTitle>
            <CardDescription>
              Latest updates and announcements from the company
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {data.recentPosts.slice(0, 5).map((post: any) => (
                <div key={post.id} className="border rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                    <Badge className={`${getPostTypeColor(post.type)} w-fit`}>
                      {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                    </Badge>
                    <div className="text-xs sm:text-sm text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-gray-800 mb-2 line-clamp-3">
                    {post.content}
                  </p>
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    {post.engagement || 0} engagements
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Postings - Mobile Responsive */}
      {data.jobPostings && data.jobPostings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Active Job Postings
            </CardTitle>
            <CardDescription>
              Current open positions and hiring trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mobile View - Card Layout */}
            <div className="sm:hidden space-y-3">
              {data.jobPostings.slice(0, 8).map((job: any) => (
                <div key={job.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{job.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {job.department}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{job.location}</p>
                  <p className="text-xs text-gray-500">
                    Posted: {new Date(job.datePosted).toLocaleDateString()}
                  </p>
                  {job.requirements && job.requirements.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {job.requirements
                        .slice(0, 3)
                        .map((req: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {req}
                          </Badge>
                        ))}
                      {job.requirements.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{job.requirements.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop View - Table Layout */}
            <div className="hidden sm:block">
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
                  {data.jobPostings.slice(0, 10).map((job: any) => (
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
                            ?.slice(0, 3)
                            .map((req: string, index: number) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {req}
                              </Badge>
                            ))}
                          {job.requirements?.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{job.requirements.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Data States */}
      {(!data.recentPosts || data.recentPosts.length === 0) &&
        (!data.jobPostings || data.jobPostings.length === 0) && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Limited Data Available
                </h3>
                <p className="text-gray-500">
                  We found basic company information but no recent posts or job
                  postings.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
