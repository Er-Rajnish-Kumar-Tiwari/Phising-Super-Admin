// import { CountryType } from "@/contracts/master";
import { MutationOptionsType, QueryOptionsGenricType } from "@/contracts/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queries } from "../queryKeys";
import * as API from "./api";
import { EmailVerificationList } from "@/contracts/employee";

export interface UserRoleType {
  _id: string; // Assuming MongoDB ObjectId stored as a string
  name: string;
  code: string;
  description: string;
  deleted: boolean;
  status: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export const useEmployeeById = (
  data: API.employeeListTypeNew,
  options?: QueryOptionsGenricType<API.PaginatedResponse, Error>
) =>
  useQuery<API.PaginatedResponse, Error>(
    queries?.employee?.getEmployeeList(data).queryKey,
    API.getEmployeeById(data),
    { ...options, enabled: !!data.employeeListName }
  );

// sign up
export const useAddEmployee = (options?: MutationOptionsType) =>
  useMutation(API.addEmployee, options);

// sign up
export const useUploadcsv = (options?: MutationOptionsType) =>
  useMutation(({data,employeeName})=>API.uploadcsv(data,employeeName), options);

// amenities
// export const useAmenities = () => useQuery(['ver'], API.verifyEmail)

export const useGetEmployeeList = (
  data: API.employeeListType,
  options?: QueryOptionsGenricType<API.EmployeeTableType, Error>
) =>
  useQuery<API.EmployeeTableType, Error>(
    queries?.employee?.getUserList(data).queryKey,
    () => API.empoyeeList(data),
    options
  );

export const useGetEmployeeListById = (
  data: API.employeeListType,
  options?: QueryOptionsGenricType<API.PaginatedEmployeeList, Error>
) =>
  useQuery<API.PaginatedEmployeeList, Error>(
    queries?.employee?.getUserList(data).queryKey,
   ()=> API.getEmployeeListById(data),
    options
  );

export const useGetEmployeeMainList = (
  data: API.employeeListType,
  options?: QueryOptionsGenricType<EmailVerificationList, Error>
) =>
  useQuery<EmailVerificationList, Error>(
    queries?.employee?.getUserList(data).queryKey,
    () => API.employeeMainList(data),
    options
  );

export const useGetUserMainList = (
  data: API.employeeListType,
  options?: QueryOptionsGenricType<EmailVerificationList, Error>
) =>
  useQuery<EmailVerificationList, Error>(
    queries?.employee?.getEmailList(data).queryKey,
    () => API.userMainList(data),
    options
  );

export const useDownloadcsv = (
  data: API.employeeListTypeNew,
  options?: QueryOptionsGenricType<any, Error>
) =>
  useQuery<any, Error>(
    [queries.employee?.downloadSalesStatemt(data.id)],
    () => API.exportCsv(data),
    options
  );

export const useGenerateVerifyied = (options?: MutationOptionsType) =>
  useMutation(API.generateVerifiedEmail, options);

export const useUpdateEmail = (options?: MutationOptionsType) =>
  useMutation(API.updateEmail, options);

export const useRemoveEmployee = (options: MutationOptionsType) =>
  useMutation(API.RemoveEmployeeList, options);

export const useRemoveEmail = (options: MutationOptionsType) =>
  useMutation(API.RemoveEmailList, options);

export const useRemoveEmails = (options: MutationOptionsType) =>
  useMutation(API.RemoveEmail, options);

export const useUpdateEmployeeStatus = (options: MutationOptionsType) =>
  useMutation(API.updateEmployeeListStatus, options);

export const useAddDirectorySync = (options?: MutationOptionsType) =>
  useMutation(API.addDirectorySync, options);

export const useGetEmailTracking = (
  data: { email: string; link: string },
  options?: QueryOptionsGenricType<any, Error>
) =>
  useQuery<any, Error>(
    queries?.employee?.emaiTracking.queryKey,
    () => API.emailTracking(data),
    options
  );
//verify Email
// export const verifyEmail = (data: verifyEmailType) =>
//   GET({
//     url: `${ROUTES.AUTH_URL}/otp/verify?email=${data.email}&otp=${data.otp}`,
//   }).then((res) => res?.data)
