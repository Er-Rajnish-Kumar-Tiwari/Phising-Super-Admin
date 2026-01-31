
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { useChangePassword } from "@/service/settings";
import toast from "react-hot-toast";

const resetPasswordValidationSchema = yup.object({
  oldPassword: yup
  .string()
  .required("Old Password is required")
  .min(8, "Old Password must be at least 8 characters")
  .max(15, "Old Password must not exceed 15 characters")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%^&*])[A-Za-z\d@#$!%^&*]+$/,
    "Old Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  ),
  newPassword: yup
    .string()
    .required("New Password is required")
    .min(8, "New Password must be at least 8 characters")
    .max(15, "New Password must not exceed 15 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%^&*])[A-Za-z\d@#$!%^&*]+$/,
      "New Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .min(8, "Confirm Password must be at least 8 characters")
    .max(15, "Confirm Password must not exceed 15 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%^&*])[A-Za-z\d@#$!%^&*]+$/,
      "Confirm Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .oneOf([yup.ref("newPassword")], "The New Password and Confirm Password does not match"),
});
const ChangePassword = () => {
  const [oldPasswordType, setOldPasswordType] = useState("password");
    const [newPasswordType, setNewPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");

  const {mutate:ChangePassowrd}=useChangePassword({
    onSuccess(data, variables, context) {
      console.log(data)
      ChangeForm.reset()
      toast.success("Password change successfully")
    },
    onError(error:any) {
      toast.error(error.response.data.message)
    },
  })
    const ChangeForm = useForm({
        resolver: yupResolver(resetPasswordValidationSchema),
        mode: "all",
      });

      const toggleOldPasswordType = () => {
        setOldPasswordType((prevType) =>
          prevType === "password" ? "text" : "password"
        );
      };
    
      const togglePasswordType = () => {
        setNewPasswordType((prevType) =>
          prevType === "password" ? "text" : "password"
        );
      };
    
      const toggleConfirmPasswordType = () => {
        setConfirmPasswordType((prevType) =>
          prevType === "password" ? "text" : "password"
        );
      };

      const onSubmit=(data:any)=>{
        const obj={
          userId:localStorage.getItem("user") as string,
          oldPassword:data.oldPassword as string,
          newPassword:data.newPassword as string
        }
        ChangePassowrd(obj)
      }
  return (
    <form 
                onSubmit={ChangeForm.handleSubmit(onSubmit)}
                className="mt-5 pb-20 space-y-4 "
              >
                <div>
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="password"
                      className="mb-2 block font-bold text-default-600"
                    >
                      Old Password
                    </Label>
                  </div>

                  <div className="relative">
                    <Input
                      type={oldPasswordType}
                      id="password"
                      // disabled={isPending}
                      {...ChangeForm.register("oldPassword")}
                      className={cn("pr-10", {
                        "border-destructive":
                          ChangeForm.formState.errors.oldPassword,
                      })}
                      // onChange={onPasswordChange}
                      placeholder="********"
                    />
                    <div
                      className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
                      onClick={toggleOldPasswordType}
                    >
                      {oldPasswordType === "password" ? (
                        <Icon
                          icon="heroicons:eye"
                          className="w-5 h-5 text-default-400"
                        />
                      ) : (
                        <Icon
                          icon="heroicons:eye-slash"
                          className="w-5 h-5 text-default-400"
                        />
                      )}
                    </div>
                  </div>
                  {ChangeForm.formState.errors.oldPassword && (
                    <div className="text-destructive mt-2">
                      {ChangeForm.formState.errors.oldPassword.message}
                    </div>
                  )}
                </div>
                {/* Password Field */}
                <div>
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="password"
                      className="mb-2 block font-bold text-default-600"
                    >
                      New Password
                    </Label>
                  </div>

                  <div className="relative">
                    <Input
                      type={newPasswordType}
                      id="password"
                      // disabled={isPending}
                      {...ChangeForm.register("newPassword")}
                      className={cn("pr-10", {
                        "border-destructive":
                          ChangeForm.formState.errors.newPassword,
                      })}
                      // onChange={onPasswordChange}
                      placeholder="********"
                    />
                    <div
                      className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
                      onClick={togglePasswordType}
                    >
                      {newPasswordType === "password" ? (
                        <Icon
                          icon="heroicons:eye"
                          className="w-5 h-5 text-default-400"
                        />
                      ) : (
                        <Icon
                          icon="heroicons:eye-slash"
                          className="w-5 h-5 text-default-400"
                        />
                      )}
                    </div>
                  </div>
                  {ChangeForm.formState.errors.newPassword && (
                    <div className="text-destructive mt-2">
                      {ChangeForm.formState.errors.newPassword.message}
                    </div>
                  )}
                </div>
                {/* <PasswordStrengthBar strength={passwordStrength} /> */}
                {/* Confirm Password Field */}

                <div>
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="confirmPassword"
                      className="mb-2 block font-bold text-default-600"
                    >
                      Confirm Password
                    </Label>
                  </div>

                  <div className="relative">
                    <Input
                      type={confirmPasswordType}
                      id="confirmPassword"
                      // disabled={isPending}
                      {...ChangeForm.register("confirmPassword")}
                      className={cn("pr-10", {
                        "border-destructive":
                          ChangeForm.formState.errors.newPassword,
                      })}
                      placeholder="********"
                    />
                    <div
                      className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
                      onClick={toggleConfirmPasswordType}
                    >
                      {confirmPasswordType === "password" ? (
                        <Icon
                          icon="heroicons:eye"
                          className="w-5 h-5 text-default-400"
                        />
                      ) : (
                        <Icon
                          icon="heroicons:eye-slash"
                          className="w-5 h-5 text-default-400"
                        />
                      )}
                    </div>
                  </div>
                  {ChangeForm.formState.errors.confirmPassword && (
                    <div className="text-destructive mt-2">
                      {ChangeForm.formState.errors.confirmPassword.message}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button className="w-full bg-purple-950 text-white hover:bg-purple-800">Update Password</Button>
              </form>
  )
}

export default ChangePassword