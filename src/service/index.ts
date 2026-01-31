// import { CountryType } from "@/contracts/master";
import { MutationOptionsType, QueryOptionsGenricType } from "@/contracts/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queries } from "./queryKeys";
import * as API from "./api";

export interface UserRoleType {
  // deletedAt: null | string; // Can be null or a string (ISO date if needed)
  _id: string; // Assuming MongoDB ObjectId stored as a string
  name: string;
  code: string;
  description: string;
  deleted: boolean;
  status: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export const useGetUserType = (
  options?: QueryOptionsGenricType<UserRoleType[], Error>
) =>
  useQuery<UserRoleType[], Error>(
    [queries?.auth?.getUserType],
    API.getUserType(),
    options
  );


// sign up
export const useSignUp = (options?: MutationOptionsType) =>
  useMutation(API.signup, options);

// sign up
export const useSignin = (options?: MutationOptionsType) =>
  useMutation(API.signin, options);

// forgot-password
export const useForgotPassword = (options?: MutationOptionsType) =>
  useMutation(API.forgotPassword, options);

//reset password
export const useResetPassword = (options?: MutationOptionsType) =>
  useMutation(API.resetPassword, options);

//verify email
export const useVerifyEmail = (options?: MutationOptionsType) =>
  useMutation(API.verifyEmail, options);

export const useVerifyLoginEmail = (options?: MutationOptionsType) =>
  useMutation(API.verifyLoginEmail, options);

export const useGetVerifyEmail = (
  data: API.verifyEmailType,
  options?: QueryOptionsGenricType<any, Error>
) =>
  useQuery<any, Error>(
    queries?.auth?.verifyEmail(data.email).queryKey,
    () => API.verifyEmail(data),
    options
  );
