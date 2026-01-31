import { GET, POST } from "@/lib/AxiosClient";
import * as ROUTES from "./routes";

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

export interface LoginAuthType {
  email: string;
  password: string;
}

//sign up
export const signin = (data: LoginAuthType) =>
  POST({
    url: `${ROUTES.AUTH_URL}/users/login`,
    data,
  });
//sign up
export const signup = (data: SignUpAuthType) =>
  POST({
    url: `${ROUTES.AUTH_URL}/users`,
    data,
  });

export const getUserType = () => () =>
  GET({
    url: `${ROUTES.AUTH_URL}/userType`,
  }).then((res) => res.data);

//forgot password
export const forgotPassword = (data: ForgotPasswordType) =>
  POST({
    url: `${ROUTES.AUTH_URL}/users/forget-password`,
    data,
  });

//reset password
export const resetPassword = (data: ResetPasswordType) =>
  POST({
    url: `${ROUTES.AUTH_URL}/users/reset-password`,
    data,
  });

//verify Email
export const verifyLoginEmail = (data: verifyEmailType) =>
  POST({
    url: `${ROUTES.AUTH_URL}/otp/verify-reset-login?email=${data.email}&otp=${data.otp}`,
  });

  export const verifyEmail = (data: verifyEmailType) =>
  POST({
    url: `${ROUTES.AUTH_URL}/users/verify-company-domain-otp?email=${data.email}&otp=${data.otp}`,
  });
