import { MutationOptionsType, QueryOptionsGenricType } from "@/contracts/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queries } from "../queryKeys";
import * as API from "./api";
import { employeeListType } from "../employee/api";
import {
  User,
  UserResponse,
  UserRole,
  UsersResponse,
} from "@/contracts/settings";

export const useGetUserList = (
  data: employeeListType,
  options?: QueryOptionsGenricType<UsersResponse, Error>
) =>
  useQuery<UsersResponse, Error>(
    queries?.settings?.getUserList(data).queryKey,
    () => API.UserList(data),
    options
  );

export const useGetUserRole = (
  options?: QueryOptionsGenricType<UserRole[], Error>
) =>
  useQuery<UserRole[], Error>(
    queries?.settings.getuserRole.queryKey,
    () => API.UserRole(),
    options
  );

export const useGetUserDetails = (
  options?: QueryOptionsGenricType<User, Error>
) =>
  useQuery<User, Error>(
    queries?.settings.getuserRoleType.queryKey,
    () => API.UserDetails(),
    options
  );

export const useAddUser = (options?: MutationOptionsType) =>
  useMutation(API.addUserDetails, options);

export const useChangePassword = (options?: MutationOptionsType) =>
  useMutation(API.changePassword, options);

export const useRemoveUser = (options: MutationOptionsType) =>
  useMutation(API.RemoveUser, options);

export const useUpdateUser = (options: MutationOptionsType) =>
  useMutation(API.updateUser, options);

export const useUpdateProfile = (options: MutationOptionsType) =>
  useMutation(API.updateUserPofile, options);
