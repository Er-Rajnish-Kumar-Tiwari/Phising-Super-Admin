import React, { FC, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SelectComponent } from "@/components/SelectComponet";
import { SelectStyles } from "@/pages/auth/pages/constant";
import { useAddUser, useGetUserRole, useUpdateUser } from "@/service/settings";
import { User } from "@/contracts/settings";
import toast from "react-hot-toast";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  country: yup
    .object()
    .shape({
      label: yup.string(),
      value: yup.string(),
    })
    .required("Select the Country"),
  fullName: yup
    .string()
    .required("Enter your Name")
    .matches(/^[A-Za-z\s]+$/, "Name must contain only alphabetic characters"),
});

type PropsType = {
  isUpdate?: boolean;
  userData?: User;
  refetch: <TPageData>(
    options?: RefetchOptions & RefetchQueryFilters<TPageData>,
  ) => Promise<QueryObserverResult<any, Error>>;
};

const AddOrUpdate: FC<PropsType> = ({
  isUpdate = false,
  userData,
  refetch,
}: PropsType) => {
  const [isOpen, setIsOpen] = useState(false);
  const editorTriggertext = `${isUpdate ? "Edit User" : "Add User"}`;

  const { data: UserRoleType } = useGetUserRole();
  const { mutate: AddUser } = useAddUser({
    onSuccess(data) {
      console.log("data");
      console.log(data);
      setIsOpen(false);
      reset();
      refetch();
    },
  });

  const { mutate: UpdateUserDetail } = useUpdateUser({
    onSuccess(data) {
      console.log("data");
      console.log(data);
      setIsOpen(false);
      reset();
      refetch();
    },
  });
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      country: { label: "", value: "" },
    },
  });

  const UserRoles = useMemo(() => {
    return UserRoleType?.map((a) => ({
      label: `${a.name}  `,
      value: a._id,
    }));
  }, [UserRoleType]);

  console.log("UserRoles", UserRoles);

  const addressCountry = watch("country");
  console.log("add", addressCountry);
  const onSubmit = (data: any) => {
    if (isUpdate === false) {
      const obj = {
        userId: localStorage.getItem("user") as string,
        firstName: data.fullName.split(" ")[0],
        lastName:
          data.fullName.split(" ").length > 0
            ? data.fullName.split(" ")[1]
            : "",
        email: data.email,
        userType: data.country.value,
      };
      AddUser(obj);
      toast.success("User has been added successfully");
    } else if (isUpdate === true) {
      const obj = {
        // _id:userData?._id,
        userId: localStorage.getItem("user") as string,
        firstName: data.fullName.split(" ")[0],
        lastName:
          data.fullName.split(" ").length > 0
            ? data.fullName.split(" ")[1]
            : "",
        email: data.email,
        userType: data.country.value,
      };
      UpdateUserDetail({ userData: obj, id: userData?._id as string });
      toast.success("User has been updated successfully");
    }
  };

  useEffect(() => {
    if (isUpdate === true && userData) {
      setValue("fullName", userData.firstName + " " + userData.lastName);
      setValue("email", userData?.email as string);
      setValue("country.label", userData?.userType.name);
      setValue("country.value", userData?.userType._id);
    }
  }, [userData]);

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      reset({
        fullName: "",
        email: "",
        country: { label: "", value: "" },
      });
    }
  }, [isOpen, reset]);

  console.log(UserRoleType);
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {isUpdate ? (
            <div className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-square-pen-icon lucide-square-pen text-brand"
              >
                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
              </svg>
            </div>
          ) : (
            <Button className="w-fit px-5 bg-purple-950 text-white hover:bg-purple-800">
              Add User
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="mb-[10]   max-h-[40.6875rem]  lg:max-w-[35rem] p-0">
          <DialogHeader className="border-lightGray bg-cultured h-[3.875rem] rounded-t-lg border-b text-left justify-center ">
            <DialogTitle className=" lg:p-[1.56rem] text-lg font-semibold leading-5 px-2">
              {isUpdate ? "Edit User" : "Add New User"}
            </DialogTitle>
          </DialogHeader>
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="">
              <div className="space-y-4">
                {/* Email Field */}

                {/* Full Name Field */}
                <div className="grid grid-cols-1 gap-4 mb-2">
                  <div>
                    <Label
                      htmlFor="fullName"
                      className="mb-2 block font-bold text-default-600"
                    >
                      Full Name
                    </Label>
                    <Input
                      {...register("fullName")}
                      type="text"
                      id="fullName"
                      className={cn("", {
                        "border-destructive": errors.fullName,
                      })}
                      //size={!isDesktop2xl ? "xl" : "lg"}
                      placeholder="John Deo"
                    />
                    {errors.fullName && (
                      <div className="text-destructive mt-2">
                        {errors.fullName.message}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="mb-2 block font-bold text-default-600"
                  >
                    Email
                  </Label>
                  <Input
                    {...register("email")}
                    type="email"
                    id="email"
                    className={cn("", { "border-destructive": errors.email })}
                    placeholder="Email address"
                  />
                  {errors.email && (
                    <div className="text-destructive mt-2">
                      {errors.email.message}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex gap-1 items-center w-full">
                    <Label
                      htmlFor="role"
                      className=" block mb-2 font-bold text-default-600"
                    >
                      Select User Role
                    </Label>
                  </div>
                  <SelectComponent
                    {...register("country")}
                    styles={SelectStyles}
                    options={UserRoles}
                    placeholder="Select User Role"
                    clName="text-[#696767] block mb-4 mx-auto sm:mx-0 focus:border-primary lg:h-[2.25rem] w-full sm:mb-0"
                    value={addressCountry}
                    onChange={(selectedOption) => {
                      setValue("country", selectedOption); // Update the form value
                    }}
                  />
                  {errors.country && !getValues("country")?.label && (
                    <div className="text-destructive mt-2">
                      {errors.country.label?.message ||
                        errors.country.value?.message}
                    </div>
                  )}
                </div>

                {/* <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                  
                </div> */}

                
                
                <Button className="w-full bg-purple-950 text-white hover:bg-purple-800">
                  {editorTriggertext}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddOrUpdate;
