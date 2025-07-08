"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, TrendingUp, Search, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [companyName, setCompanyName] = useState("");

  const features = [
    {
      icon: <Building2 className="h-8 w-8 text-blue-600" />,
      title: "Company Analysis",
      description:
        "Deep dive into company profiles, recent posts, and organizational changes",
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Employee Insights",
      description:
        "Track leadership changes, hiring patterns, and employee achievements",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      title: "Competitive Intelligence",
      description:
        "Compare companies and identify market trends and opportunities",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-600 p-3 rounded-full mr-4">
            <Search className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            LinkedIn Research Hub
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Automate your LinkedIn research with AI-powered insights. Discover
          hiring trends, leadership changes, and competitive intelligence in
          minutes, not hours.
        </p>
      </div>

      {/* Quick Start */}
      <Card className="mb-12 card-hover">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ArrowRight className="h-5 w-5 mr-2 text-blue-600" />
            Quick Company Analysis
          </CardTitle>
          <CardDescription>
            Enter a company name to start your research journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter company name (e.g., Microsoft, Google, Apple)"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="flex-1"
            />
            <Link
              href={`/dashboard?company=${encodeURIComponent(companyName)}`}
            >
              <Button disabled={!companyName.trim()} className="px-8">
                Analyze Company
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {features.map((feature, index) => (
          <Card key={index} className="card-hover">
            <CardHeader>
              <div className="flex items-center mb-2">
                {feature.icon}
                <CardTitle className="ml-3">{feature.title}</CardTitle>
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Capabilities */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Research Capabilities</CardTitle>
          <CardDescription>
            Comprehensive LinkedIn data collection and analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-gray-900">
                Company Intelligence
              </h3>
              <div className="space-y-2">
                <Badge variant="secondary">Recent Posts & Updates</Badge>
                <Badge variant="secondary">Job Postings Analysis</Badge>
                <Badge variant="secondary">Branch Expansions</Badge>
                <Badge variant="secondary">Company Milestones</Badge>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-gray-900">
                People Analytics
              </h3>
              <div className="space-y-2">
                <Badge variant="secondary">Leadership Changes</Badge>
                <Badge variant="secondary">Hiring Trends</Badge>
                <Badge variant="secondary">Employee Achievements</Badge>
                <Badge variant="secondary">Skills & Expertise</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <Link href="/dashboard">
          <Button size="lg" className="px-8 py-3">
            Start Research Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
