export type EmployeeDataArray = {
    employeeId: string;
    employeeDetails: {
      firstName: string;
      lastName: string;
      email: string;
      country: string;
      language: string;
      _id: string;
    }[];
    phishingScore: {
      securityIQScore: number;
      engagementScore: number;
      phishingScore: number;
      breachExposureScore: number;
      totalRiskScore: number;
    };
  };

 export type EmailCampaign = {
    _id: string;
    emailTrackingId: string;
    campaignName: string;
    campainCreatedAt: string; // Can handle both Date object and ISO string
    startDate?: Date | string | null; // Made optional with ?
    endDate?: Date | string | null;   // Made optional with ?
    totalEmailsSent: number;
    totalOpens: number;
    totalClicks: number;
    openRate: number;
    clickRate: number;
  };

  //super Admin
 export type Organization = {
  employees: number;
  userId: string;
  domain: string;
  contactEmail: string;
  lastLogin: null | Date | string; // Adjust based on actual data type
  region: string;
  campaigns: number;
  organizationName: string;
};

export type StatsData = {
  totalUsers: number;
  totalCampaigns: number;
  totalOrganizations: number;
  organizations: Organization[];
};