interface UserType {
    _id: string;
    name: string;
    code: string;
    description: string;
    deleted: boolean;
    deletedAt: string | null;
    status: boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  }
  
export  interface User {
    _id: string;
    status: boolean;
    deleted: boolean;
    deletedAt: string | null;
    userType: UserType;
    fullName:string,
    firstName: string;
    lastName: string;
    email: string;
    lastLoggedIn: string | null; // ISO date string or null
    companyName: string;
    isTermsAccepted: boolean;
    country: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    companyId: number;
  }
  
  // For API responses that might return a user
 export  interface UserResponse {
    data: User[];
    message?: string;
    success: boolean;
  }
  
  // For arrays of users (e.g., in listings)
  export interface UsersResponse {
    data: User[];
    total: number;
    currentPage: number;
    totalPages: number;
  }

 export interface UserRole {
    // Core fields
    _id: string;
    name: string;
    code: string;
    description: string;
    
    // Status fields
    deleted: boolean;
    status: boolean;
    deletedAt: null; // Explicitly null when not deleted
    
    // Timestamps (as strings)
    createdAt: string; // ISO 8601 format
    updatedAt: string; // ISO 8601 format
    
    // Optional permissions field (example extension)
    permissions?: string[];
  }

export  interface addUser {
    email: string;
    userId: string; // Or a more specific type if you know the structure
    userType: string; // Or a more specific type if you know the structure
    firstName: string;
    lastName: string;
    webUrl?: string;
  }

export interface PasswordChangeRequest {
    userId: string;
    oldPassword: string;
    newPassword: string;
    // Optional fields
    // confirmNewPassword?: string; // For client-side validation
  }

export interface UpdateUserType {
  userData:addUser,
  id:string
}

export type UserDetail = {
  userId: string;
  fullName?: string;
  companyName?: string; // Optional
  country?: string;
};
