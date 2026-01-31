import { DELETE, GET, POST } from "@/lib/AxiosClient";
import * as ROUTES from "../routes";

export enum CampaignStep {
  FIRST_NAME = "firstName",
  TEMPLATE_SELECTION = "templateSelection",
  SCHEDULE = "schedule",
  REVIEW = "review",
}

export enum CampaignScheduleType {
  SetupLater = "setup_later",
  Immediately = "immediately",
  Setup = "setup",
}

export enum CampaignFrequency {
  ONCE = "once",
  Weekly = "weekly",
  Monthly = "monthly",
  Quarterly = "quarterly",
  Fortnightly = "fortnightly",
  // SetupLater = 'setup_later',
  // Immediately = 'immediately'
}


interface EmployeeDetailType {
  employeeDocumentId: string;
}

interface Campaign {
  campaignName?: string;
  // campaignId: Record<string, unknown>; // or a more specific type if you know the structure
  campaignId?: string;
  // userId: Record<string, unknown>; // or a more specific type if you know the structure
  userId?: string;
  campaignType?: string; // or a union type if there are other possible values
  //templateIds: Array<Record<string, unknown>>; // or a more specific type for the template IDs
  templateIds?: string[];
  // scheduleType?: CampaignScheduleType;
  scheduleType?: string;
  schedulefrequecy?: CampaignFrequency;
  scheduleDateTime?: string; // or Date if you'll parse it
  scheduleTime?: string;
  startDate?: string;
  endDate?: string;
  employees?: EmployeeDetailType[];
  campaignStep?: CampaignStep; // or a union type if there are other possible steps
}

export type campaignListTypeNew = {
  id: string;
  search: string;
  pageSize: number;
  page: number;
};

export type templateType = {
  search: string;
  pageSize: number;
  page: number;
  category?: string;
};

export type CampaignPagination = {
  _id: string;
  campaignName: string;
  deliveryStatus: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  employeeDetailsCount?: number;
};


enum Status {
  Start = "Start",
  UnderProgress = "Under-Progress",
  Finished = "Finished",
}
export type EmailCampaignStatus = {
  _id: string;
  campaignName: string;
  startDate: Date | null;
  endDate: Date | null;
  scheduledDateTime: string; // Could also use Date if you parse it
  deliveryStatus: Status;
  totalEmailsSent: number;
  totalOpens: number;
  totalClicks: number;
  openRate: number;
  clickRate: number;
  // Optional fields if they might exist in some cases
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  viewPercentage?: number;
  clickPercentage?: number;
};


export type CampaignStatusTableType = {
  data: EmailCampaignStatus[];
  total: number;
  page: number;
  pageSize: number;
  totalCount: number;
};

export type DirectoryList = {
  _id: string;
  employeeListName: string;
  createdAt: string; // or Date if you'll parse it
  totalEmployees: number;
  isVerify: boolean;
  employeeId: number;
};

export type DirectoryStatusTableType = {
  data: DirectoryList[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export type CampaignTableType = {
  campaigns: any[];
  totalCount: number;
  page: number;
  pageSize: number;
  total:number
};

interface Template {
  _id: string;
  templateName: string;
  templateType: string; // Or use a union like "AI-generated" | "Manual" | etc. if known
  content: string;
  createdAt: string; // ISO date string (can also use Date if parsing)
}

export interface PaginatedTemplates {
  total: number;
  page: number;
  pageSize: number;
  templates: Template[];
}

export interface EmailTemplate {
  templateName: string;
  templateType: string; // Consider using union type if possible, e.g., "transactional" | "marketing"
  content: string;
  image?: string;
  placeholders: string[];
  subject: string;
  senderName?: string;
  senderEmail?: string;
  ctaButtonName?: string;
  isActive: boolean;
}

export type ExcelOrCsvType = {
  id: string;
  search: string;
  pageSize: number;
  page: number;
  format: string;
};

type AIGenerateType = {
  userId: string;
  templateName: string;
  category: string;
  tone: string;
  industry: string;
};

export const addCampaign = (data: Campaign) =>
  POST({
    url: `${ROUTES.AUTH_URL}/campaign/add`,
    data,
  });

export const getCampaignById = (data: campaignListTypeNew) => () =>
  GET({
    url: `${ROUTES.AUTH_URL}/campaign/get-campaign-userId/${data.id}?page=${data.page}&pageSize=${data.pageSize}&search=${data.search}`,
  }).then((res) => res.data);

export const getTemplateList = (data: {userId:string, search: string; category: string }) =>
  GET({
    url: `${ROUTES.AUTH_URL}/template?userId=${data.userId}&search=${data.search}&category=${data.category}`,
  }).then((res) => res.data);

export const getTemplateListById = (data: { id: string }) =>
  GET({
    url: `${ROUTES.AUTH_URL}/template/${data.id}`,
  }).then((res) => res.data);

export const uploadImage = (data: { image: string }) =>
  POST({
    url: `${ROUTES.AUTH_URL}/template/upload-image`,
    data,
  });

export const addTemplate = (data: EmailTemplate) =>
  POST({
    url: `${ROUTES.AUTH_URL}/template/add`,
    data,
  });

export const generateTemplate = (data: AIGenerateType) =>
  POST({
    url: `${ROUTES.AUTH_URL}/template/generate`,
    data,
  });

export const RemoveCampaignList = (data: { campaignId: string }) =>
  DELETE({
    url: `${ROUTES.AUTH_URL}/campaign/delete-campaign/${data.campaignId}`,
  });

export const getReportingById = (data: campaignListTypeNew) => () =>
  GET({
    url: `${ROUTES.AUTH_URL}/tracking/email-report/${data.id}?page=${data.page}&pageSize=${data.pageSize}&search=${data.search}`,
  }).then((res) => res.data);

//verify Email
export const exportExcelORCsv = (data: ExcelOrCsvType) =>
  GET({
    url: `${ROUTES.AUTH_URL}/tracking/export/${data.id}?page=${data.page}&pageSize=${data.pageSize}&search=${data.search}&format=${data.format}`,
    responseType: "blob",
  }).then((res) => res.data);

export const TestEmail = (data: {
  email: string;
  templateId: string;
  userId: string;
}) =>
  POST({
    url: `${ROUTES.AUTH_URL}/campaign/send-test-email`,
    data,
  });

export const getDirectoryInfo = (data: campaignListTypeNew) => () =>
  GET({
    url: `${ROUTES.AUTH_URL}/employee/get-group-list/${data.id}?page=${data.page}&pageSize=${data.pageSize}&search=${data.search}`,
  }).then((res) => res.data[0]);

export const DublicateCampaign = (data: {
  userId: string;
  campaignId: string;
  campaingName: string;
}) =>
  POST({
    url: `${ROUTES.AUTH_URL}/campaign/duplicate-campaign`,
    data,
  });

export const updateCampaign = (data: Campaign) =>
  POST({
    url: `${ROUTES.AUTH_URL}/campaign/update-campaign`,
    data,
  });

export const getCampaignEmails = (data: { campaignId: string; page: number; pageSize: number; search?: string }) => () =>
  GET({
    url: `${ROUTES.AUTH_URL}/tracking/campaign/${data.campaignId}/emails?page=${data.page}&pageSize=${data.pageSize}${data.search ? `&search=${encodeURIComponent(data.search)}` : ''}`,
  }).then((res) => res.data);

export type CampaignEmailRecord = {
  campaignId: string;
  email: string;
  createdAt: string;
  delivered: boolean;
  viewed: boolean;
  clicked: boolean;
  deliveryStatus: string;
  campaignName: string;
};
