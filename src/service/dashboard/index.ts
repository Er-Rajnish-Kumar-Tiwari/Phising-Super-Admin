import { MutationOptionsType, QueryOptionsGenricType } from "@/contracts/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queries } from "../queryKeys";
import * as API from "./api";
import { EmailCampaign, EmployeeDataArray, StatsData } from "@/contracts/dashboard";
export const useHumanRisk = (
  data: { id: string },
  options?: QueryOptionsGenricType<EmployeeDataArray[], Error>
) =>
  useQuery<EmployeeDataArray[], Error>(
    queries?.dashboard?.getHumanRisk(data).queryKey,
    () => API.getHumanRiskById(data),
    options
  );

export const useOverview = (
  data: { id: string },
  options?: QueryOptionsGenricType<
    { users: number; campaign: number; emailTracking: { clickRate: string } },
    Error
  >
) =>
  useQuery<
    { users: number; campaign: number; emailTracking: { clickRate: string } },
    Error
  >(
    queries?.dashboard?.getOverview(data).queryKey,
    () => API.getOverviewById(data),
    options
  );

export const useMonthlyTrend = (
  data: { id: string },
  options?: QueryOptionsGenricType<
    { month: string; clickRate: number }[],
    Error
  >
) =>
  useQuery<{ month: string; clickRate: number }[], Error>(
    queries?.dashboard?.getMonthlyTrends(data).queryKey,
    () => API.getMonthlyTrend(data),
    options
  );

export const useRecentCampaign = (
  data: { id: string },
  options?: QueryOptionsGenricType<EmailCampaign[], Error>
) =>
  useQuery<EmailCampaign[], Error>(
    queries?.dashboard?.getRecetCampaigns(data).queryKey,
    () => API.getRecentCampaign(data),
    options
  );


  //super admin 
  export const useRecent = (
  options?: QueryOptionsGenricType<StatsData, Error>
) =>
  useQuery<StatsData, Error>(
    queries?.dashboard?.getRecent.queryKey,
    () => API.getRecent(),
    options
  );

  export const useDownloadTextFile = (
    data: {userId:string},
    options?: QueryOptionsGenricType<any, Error>
  ) =>
    useQuery<any, Error>(
      queries.dashboard.downloadTextFile(data.userId).queryKey,
      () => API.exportTextFile(data),
      options
    );