import { DELETE, GET, POST, PUT } from "@/lib/AxiosClient";
import * as ROUTES from "../routes";
import { employeeListType } from "../employee/api";
import {
  addUser,
  PasswordChangeRequest,
  UpdateUserType,
  UserDetail,
} from "@/contracts/settings";
//verify Email
export const UserList = (data: employeeListType) =>
  GET({
    url: `${ROUTES.AUTH_URL}/comapny-users/get-company-user/${data.id}?page=${data.page}&pageSize=${data.pageSize}&search=${data.search}`,
  }).then((res) => res.data);

export const UserDetails = () =>
  GET({
    url: `${ROUTES.AUTH_URL}/users`,
  }).then((res) => res.data);

export const UserRole = () =>
  GET({
    url: `${ROUTES.AUTH_URL}/userType`,
  }).then((res) => res.data);

export const addUserDetails = (data: addUser) =>
  POST({
    url: `${ROUTES.AUTH_URL}/comapny-users/create-company-user`,
    data,
  });

export const changePassword = (data: PasswordChangeRequest) =>
  POST({
    url: `${ROUTES.AUTH_URL}/users/update-password`,
    data,
  });

export const RemoveUser = (data: { userId: string }) =>
  DELETE({
    url: `${ROUTES.AUTH_URL}/comapny-users/delete-company-user/${data.userId}`,
  });

export const updateUser = (data: UpdateUserType) =>
  PUT({
    url: `${ROUTES.AUTH_URL}/comapny-users/update-company-user/${data.id}`,
    data: data.userData,
  });

export const updateUserPofile = (data: UserDetail) =>
  PUT({
    url: `${ROUTES.AUTH_URL}/users/update-profile`,
    data,
  });
