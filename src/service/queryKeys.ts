import {
  createQueryKeys,
  mergeQueryKeys,
} from "@lukemorales/query-key-factory";
import { employeeListType, employeeListTypeNew } from "./employee/api";
import { templateType } from "./campaign/api";
import { getMonthlyTrend } from "./dashboard/api";

export const authQueries = createQueryKeys("auth", {
  userLogin: null,
  getUserInfo: null,
  getSignUpInfo: null,
  getUser: null,
  getUserType: null,
  verifyEmail: (email) => [email],
});

export const masterQueries = createQueryKeys("master", {
  getcountry: null,
  getState: (id) => [id],
});

export const employeeTableQueries = createQueryKeys("employee", {
  getUserList: (q: employeeListType) => [
    q.id,
    q.page,
    q.pageSize,
    q.search,
    // q.sortBy,
    // q.sortId,
    // q.userSubType,
  ],
  getEmailList: (q: employeeListType) => [
    q.id,
    q.page,
    q.pageSize,
    q.search,
    // q.sortBy,
    // q.sortId,
    // q.userSubType,
  ],
  getEmployeeList: (q: employeeListTypeNew) => [
    q.page,
    q.pageSize,
    q.search,
    q.employeeListName,
    // q.sortBy,
    // q.sortId,
    // q.userSubType,
  ],
  getUserProfileInfo: (id: string) => [id],
  downloadSalesStatemt: (id: string) => [id],
  emaiTracking: null,
});

export const campaignTableQueries = createQueryKeys("campaign", {
  getCampaignList: (q: employeeListType) => [
    q.id,
    q.page,
    q.pageSize,
    q.search,
  ],
  getTemplateList: (q: { search: string; category: string }) => [
    q.search,
    q.category,
  ],
  getTemplate: (id) => [id],
  getReportingList: (q: employeeListType) => [
    q.id,
    q.page,
    q.pageSize,
    q.search,
  ],
  getDirectoryList: (q: employeeListType) => [
    q.id,
    q.page,
    q.pageSize,
    q.search,
  ],
  downloadExcelOrCsv: (id: string) => [id],
});

export const settingsTableQueries = createQueryKeys("settings", {
  getUserList: (q: employeeListType) => [q.id, q.page, q.pageSize, q.search],
  getuserRole: null,
  getuserRoleType: null,
});

export const dashboardTableQueries = createQueryKeys("dashboard", {
  getRecent: null,
  getHumanRisk:(id)=>[id],
  getOverview:(id)=>[id],
  getMonthlyTrends:(id)=>[id],
  getRecetCampaigns:(id)=>[id],
  downloadTextFile: (id: string) => [id]
});

export const queries = mergeQueryKeys(
  masterQueries,
  authQueries,
  employeeTableQueries,
  campaignTableQueries,
  settingsTableQueries,dashboardTableQueries
);
