import { MutationOptionsType, QueryOptionsGenricType } from "@/contracts/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queries } from "../queryKeys";
import * as API from "./api";

export const useAddCampaign = (options?: MutationOptionsType) =>
  useMutation(API.addCampaign, options);

export const useUploadImageTemplate = (options?: MutationOptionsType) =>
  useMutation(API.uploadImage, options);

export const useAddTemplate = (options?: MutationOptionsType) =>
  useMutation(API.addTemplate, options);

export const useGenerateTemplate = (options?: MutationOptionsType) =>
  useMutation(API.generateTemplate, options);

export const useCampaignById = (
  data: API.campaignListTypeNew,
  options?: QueryOptionsGenricType<API.CampaignTableType, Error>
) =>
  useQuery<API.CampaignTableType, Error>(
    queries?.campaign?.getCampaignList(data).queryKey,
    API.getCampaignById(data),
    options
  );

export const useReportingById = (
  data: API.campaignListTypeNew,
  options?: QueryOptionsGenricType<API.CampaignStatusTableType, Error>
) =>
  useQuery<API.CampaignStatusTableType, Error>(
    queries?.campaign?.getReportingList(data).queryKey,
    API.getReportingById(data),
    options
  );

export const useTemplateList = (
  data: { search: string; category: string },
  options?: QueryOptionsGenricType<API.PaginatedTemplates, Error>
) =>
  useQuery<API.PaginatedTemplates, Error>(
    queries?.campaign?.getTemplateList(data).queryKey,
    () => API.getTemplateList(data),
    options
  );

export const useTemplateListById = (
  data: { id: string },
  options?: QueryOptionsGenricType<API.EmailTemplate, Error>
) =>
  useQuery<API.EmailTemplate, Error>(
    queries?.campaign?.getTemplate(data).queryKey,
    () => API.getTemplateListById(data),
    options
  );

export const useRemoveCampaign = (options: MutationOptionsType) =>
  useMutation(API.RemoveCampaignList, options);

export const useDownloadExcelOrcsv = (
  data: API.ExcelOrCsvType,
  options?: QueryOptionsGenricType<any, Error>
) =>
  useQuery<any, Error>(
    [queries.campaign.downloadExcelOrCsv],
    () => API.exportExcelORCsv(data),
    options
  );

export const useTestEmail = (options?: MutationOptionsType) =>
  useMutation(API.TestEmail, options);

export const useDirectoryList = (
  data: API.campaignListTypeNew,
  options?: QueryOptionsGenricType<API.DirectoryStatusTableType, Error>
) =>
  useQuery<API.DirectoryStatusTableType, Error>(
    queries?.campaign?.getDirectoryList(data).queryKey,
    API.getDirectoryInfo(data),
    options
  );

export const useDuplicateCampaign = (options?: MutationOptionsType) =>
  useMutation(API.DublicateCampaign, options);

export const useUpdateCampaign = (options?: MutationOptionsType) =>
  useMutation(API.updateCampaign, options);

export const useCampaignEmails = (
  data: { campaignId: string; page: number; pageSize: number; search?: string },
  options?: QueryOptionsGenricType<API.CampaignEmailsResponse, Error>
) =>
  useQuery<API.CampaignEmailsResponse, Error>(
    ["campaign-emails", data],
    API.getCampaignEmails(data),
    options
  );
