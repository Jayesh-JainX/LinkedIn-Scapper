import React from "react";
import { Building2, Users, TrendingUp, MapPin } from "lucide-react";
import { Card } from "../ui/card";

interface CompanyCardProps {
  company: {
    id: string;
    name: string;
    industry: string;
    size: string;
    location: string;
    employeeCount: number;
    recentHires: number;
    lastUpdated: string;
  };
  onViewDetails: (companyId: string) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onViewDetails,
}) => {
  return (
    <Card
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onViewDetails(company.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {company.name}
            </h3>
            <p className="text-sm text-gray-600">{company.industry}</p>
          </div>
        </div>
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
          Active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {company.employeeCount.toLocaleString()} employees
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">{company.location}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-sm text-gray-600">
            {company.recentHires} recent hires
          </span>
        </div>
        <span className="text-xs text-gray-500">
          Updated {company.lastUpdated}
        </span>
      </div>
    </Card>
  );
};
