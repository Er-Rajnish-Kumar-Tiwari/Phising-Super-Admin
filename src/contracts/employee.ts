export interface EmployeeDetail {
    firstName: string;
    lastName: string;
    email: string;
  }
  
 export interface FormData {
    userId: string;
    employeeListName: string;
    group: string;
    employeeDetails: EmployeeDetail[];
  }
  
  interface Employee {
    _id: string;
    status: boolean;
    deleted: boolean;
    deletedAt: null | string; // Assuming `deletedAt` can be a string (e.g., ISO date) or null
    userId: string;
    employeeDetails: EmployeeType[];
  }
  
  export interface EmployeesData {
    employees: Employee[];
    total: number;
    pageSize: number;
    page: number;
  }
  
  export type EmployeeType = {
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
  
export type uploadcsvType = {
    userId:string,
    file: string;
  };
  
  export type employeeListType = {
    id:string,
    search: string;
    pageSize: number;
    page: number;
  };
  
  // export type TableList = {
  //   page: number
  //   pageSize: number
  //   search?: string
  //   sortId?: string
  //   sortBy?: string
  //   userSubType?: string
  // }
  
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

 export interface EmployeeList {
    _id: string;
    email: string;
    isVerify: boolean;
    employeeListName: string;
    totalEmployees: number;
    createdAt:string,
    employeeId: number,
  }

  export interface EmailVerificationList {
    paginatedData:EmployeeList[],
    totalCount:number,
    total:number
  }