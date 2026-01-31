import { DELETE, GET, POST, PUT } from "@/lib/AxiosClient";
import * as ROUTES from "../routes";

export interface SignUpAuthType {
  // userType: Record<string, any>; // Assuming it's a dynamic object, update if needed
  userType?: string;
  fullName: string;
  email: string;
  companyName: string;
  password: string;
  country?: string;
  isTermsAccepted?: boolean;
}

export type ForgotPasswordType = {
  email: string;
};

export type ResetPasswordType = {
  otp: string;
  password: string;
};

export type verifyEmailType = {
  email: string;
  otp: string;
};

interface EmployeeDetails {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  language: string;
  employeeId?: number; // Optional because it's not present in all objects
  company?: string; // Optional
  jobTitle?: string; // Optional
  supervisorEmail?: string; // Optional
  customField1?: string; // Optional
  customField2?: string; // Optional
}

interface Employee {
  _id: string;
  status: boolean;
  deleted: boolean;
  deletedAt: null | string; // Assuming `deletedAt` can be a string (e.g., ISO date) or null
  userId: string;
  employeeDetails: EmployeeDetails[];
}

export interface EmployeesData {
  _id?: string;
  employees: Employee[];
  total: number;
  pageSize: number;
  page: number;
  totalEmployees: number;
  employeeId: number;
}

export type PaginatedEmployeeList = {
  paginatedData: {
    employeeListName: string;
    totalEmployees: number;
    _id: string;
  }[];
  totalCount: number;
};

type EmployeeNew = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  language: string;
  _id: string;
};

export type PaginatedItem = {
  _id: string;
  userId: string;
  employeeListName: string;
  employeeId: number;
  employee: EmployeeNew;
};

export type PaginatedResponse = {
  paginatedData: PaginatedItem[];
  totalCount: number;
};



export type EmployeeType = {
  _id?: string;
  userId: string | null; // Unique identifier for the user (likely a MongoDB ObjectId)
  firstName?: string; // User's first name
  lastName?: string; // User's last name
  email?: string; // User's email address
  company?: string; // Company the user works for
  jobTitle?: string; // User's job title
  country?: string; // User's country of residence
  language?: string; // User's preferred language
  supervisorEmail?: string; // Email of the user's supervisor/manager
  customField1?: string; // Custom field for additional data
  customField2?: string; // Another custom field for additional data
  group?: string; // Group or team the user belongs to
};

type uploadcsvType = {
  employeeListName:string;
  userId: string;
  file: string;
};

export type employeeListType = {
  id: string;
  page?: number;
  pageSize?: number;
  search: string;
};

export type employeeListTypeNew = {
  id: string;
  search: string;
  pageSize: number;
  page: number;
  employeeListName: string;
};


export type EmployeeTableType = {
  employees: EmployeeType[];
  totalCount: number;
  totalPage: number;
  totalPageSize: string;
};

export type EmployeeTableTypeById = {
  createdAt: string;
  deleted: boolean;
  deletedAt: string | null;
  employeeDetails: EmployeeType[];
  status: boolean;
  updatedAt: string;
  userId: string;
  _id: string;
};

export interface LoginAuthType {
  email: string;
  password: string;
}

export type paginationByIdType = {
  id: string;
  search: string;
  pageSize: number;
  page: number;
};

export type paginationType = {
  search: string;
  pageSize: number;
  page: number;
};

type DirectorySyncType = {
  userId: string;
  employeeListName: string;
  group?: string;
};

//sign up
export const addEmployee = (data: EmployeeType) =>
  POST({
    url: `${ROUTES.AUTH_URL}/employee/add`,
    data,
  });
//sign up
export const uploadcsv = (data: uploadcsvType,employeeName:string) =>
  POST({
    url: `${ROUTES.AUTH_URL}/employee/${localStorage.getItem(
      "user"
    )}/upload-csv?employeeListName=${employeeName}`,
    data,
  });

//verify Email
export const empoyeeList = (data: employeeListType) =>
  GET({
    url: `${ROUTES.AUTH_URL}/employee/get-employee-list?page=${data.page}&pageSize=${data.pageSize}&search=${data.search}`,
  }).then((res) => res.data);

export const getEmpoyee = () =>
  GET({
    url: `${ROUTES.AUTH_URL}/employee`,
  }).then((res) => res.data);

export const getEmployeeById = (data: employeeListTypeNew) => () =>
  GET({
    url: `${ROUTES.AUTH_URL}/employee/get-employee-by-user-id/${data.id}?page=${data.page}&pageSize=${data.pageSize}&employeeListName=${data.employeeListName}&search=${data.search}`,
  }).then((res) => res.data[0]);

export const getEmployeeListById =(data: employeeListType) =>{
  let employeeData;
  if(data.page==undefined && data.pageSize==undefined){
   employeeData= GET({
    url: `${ROUTES.AUTH_URL}/employee/get-employee-by-list/${data.id}?search=${data.search}`,
  }).then((res) => res.data[0]);
  }
  else{
  employeeData=   GET({
    url: `${ROUTES.AUTH_URL}/employee/get-employee-by-list/${data.id}?page=${data.page}&pageSize=${data.pageSize}&search=${data.search}`,
  }).then((res) => res.data[0]);
  }
  return employeeData;
}
  

//verify Email
export const employeeMainList = (data: employeeListType) =>
  GET({
    url: `${ROUTES.AUTH_URL}/employee/get-company-email-with-details/${data.id}?page=${data.page}&pageSize=${data.pageSize}&search=${data.search}`,
  }).then((res) => res.data[0]);

//verify Email
export const userMainList = (data: employeeListType) =>
  GET({
    url: `${ROUTES.AUTH_URL}/users/get-company-email-with-details/${data.id}?page=${data.page}&pageSize=${data.pageSize}&search=${data.search}`,
  }).then((res) => res.data[0]);

//verify Email
export const exportCsv = (data: employeeListTypeNew) =>
  GET({
    url: `${ROUTES.AUTH_URL}/employee/export/${data.id}?page=${data.page}&pageSize=${data.pageSize}&search=${data.search}&employeeListName=${data.employeeListName}`,
    responseType: "blob",
  }).then((res) => res.data);

export interface LoginAuthType {
  email: string;
  password: string;
}

//sign up
export const generateVerifiedEmail = (data: {
  email: string;
  userId: string;
}) =>
  POST({
    url: `${ROUTES.AUTH_URL}/users/add-company-email`,
    data,
  });

export const updateEmail = (data: { email: string }) =>
  PUT({
    url: `${ROUTES.AUTH_URL}/users/update-status/${data.email}`,
    data,
  }).then((res) => res.data);

export const RemoveEmployeeList = (data: {
  userId: string;
  employeeId: string;
}) =>
  DELETE({
    url: `${ROUTES.AUTH_URL}/employee/remove-employee/${data.userId}/${data.employeeId}`,
  });

export const RemoveEmailList = (data: { employeeId: number }) =>
  DELETE({
    url: `${ROUTES.AUTH_URL}/employee/delete-employee-list-name/${data.employeeId}`,
  });

export const RemoveEmail = (data: { employeeId: string }) =>
  DELETE({
    url: `${ROUTES.AUTH_URL}/users/delete-email/${data.employeeId}`,
  });

// export const updateEmployeeListStatus = (data: { employeeId: string,userId:string,employeeListName:string }) =>
//   PUT({
//     url: `${ROUTES.AUTH_URL}/employee/employee-list-name-status/${data.employeeId}`,
//   });

export const updateEmployeeListStatus = (data: { employeeId?: number,userId?:string,employeeListName?:string }) =>
  POST({
    url: `${ROUTES.AUTH_URL}/employee/employee-list-name-status`,
    data
  });

export const addDirectorySync = (data: DirectorySyncType) =>
  POST({
    url: `${ROUTES.AUTH_URL}/employee/group-members`,
    data,
  });

export const emailTracking = (data: { email: string; link: string }) =>
  GET({
    url: `${ROUTES.AUTH_URL}/tracking/email-click?email=${data.email}&link=${data.link}`,
  }).then((res) => res.data);
