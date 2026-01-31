import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Symbol from "@/assets/icons/auth/Symbol.svg";
import Plus from "@/assets/icons/plus.svg";
import Upload from "@/assets/icons/upload.svg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";
import {
  useAddEmployee,
  useDownloadcsv,
  useUploadcsv,
} from "@/service/employee";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "@tanstack/react-query";
import { EmployeeType } from "@/contracts/employee";
import { createExcelFileDownloadbleLink } from "@/constants/utils";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";

type ManualImportType = {
  refetchnew: <TPageData>(
    options?: RefetchOptions & RefetchQueryFilters<TPageData>
  ) => Promise<QueryObserverResult<any, Error>>;
  employeeListName: string;
  page: number;
  pageSize: number;
  EmployeeDetails?: EmployeeType[];
  EmployeeForm: any;
};
const ManualImport = (ManualProps: ManualImportType) => {
  const {
    refetchnew,
    employeeListName,
    page,
    pageSize,
    EmployeeForm,
    EmployeeDetails,
  } = ManualProps;
  const [pdffiles, setPDFFiles] = useState<File | null>();
  // const [isDownload, setIsDownload] = useState(false);
  const [downloadTrigger, setDownloadTrigger] = useState(0);
  const isDownloadingRef = useRef(false);
  const [downloadType, setDownloadType] = useState<"csv" | null>(null);

  const tableParams = {
    id: localStorage.getItem("user") as string,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    employeeListName: employeeListName || "",
    search: "",
  };

  const { isFetching: isDownloading, refetch: refetchDownload } =
    useDownloadcsv(
      {
        ...tableParams,
      },
      {
        enabled: false,
        // onSuccess: (data) => {
        //   // createExcelFileDownloadbleLink({
        //   //   data: data,
        //   //   fName: "EmployeeList.xlsx",
        //   // });
        //   toast.success("Employee details downloaded successfully");
        // },
      }
    );

  const { mutate: addEmployee } = useAddEmployee({
    onSuccess(data) {
      console.log(data);
      toast.success("Employee Added Successfully");
      EmployeeForm.setValue("fullName", "");
      EmployeeForm.setValue("email", "");
      refetchnew();
    },
    onError(error: any) {
      console.log("error", error);
      toast.error(`${error.response.data.message}`);
    },
  });

  const { mutate: uploadCsv } = useUploadcsv({
    onSuccess(data) {
      console.log(data);
      toast.success("Employee List Uploaded Successfully");
      setPDFFiles(null);
      refetchnew();
    },
    onError(error: any) {
      console.log("error", error);
      toast.error(`${error.response.data.message}`);
    },
  });

  const uploadPDF = (fileData: any) => {
    console.log("file", fileData);
    setPDFFiles(fileData);
  };

  const onSubmit = async (data: any) => {
    console.log(data);

    try {
      if (localStorage.getItem("user")) {
        const flName = data.fullName.trim().split(" ");
        console.log("fn", flName);
        const new_data = {
          firstName: flName[0],
          lastName: flName[1] ? flName[1] : "",
          email: data.email,
        };
        const finalObj = {
          userId: localStorage.getItem("user"),
          employeeListName: employeeListName,
          employeeDetails: [new_data],
          group: "rgrouptype",
        };
        addEmployee(finalObj);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleUploadcsv = (e: any) => {
    e.preventDefault();
    const formData: any = new FormData();
    formData.append("userId", localStorage.getItem("user"));
    formData.append("employeeListName", employeeListName);
    formData.append("file", pdffiles);
    console.log({ data: formData, employeeName: employeeListName });
    uploadCsv({ data: formData, employeeName: employeeListName });
  };
  const handleDownload = () => {
    // setIsDownload(true);
    setDownloadType("csv");
    setDownloadTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (downloadType && !isDownloadingRef.current) {
      isDownloadingRef.current = true;
      refetchDownload()
        .then(({ data }) => {
          if (data) {
            if (downloadType === "csv") {
              createExcelFileDownloadbleLink({
                data: data,
                fName: "EmployeeList.xlsx",
              });

              toast.success("Employee details downloaded successfully");
            }
          }
        })
        .finally(() => {
          isDownloadingRef.current = false;
          setDownloadType(null);
          // setDownloadTrigger(0)
        });
    }
  }, [downloadTrigger, downloadType, refetchDownload]);
  return (
    <div className="">
      <label className="text-sm text-gray-600">
        <button
          type="button"
          className="text-blue-500 hover:underline bg-transparent border-none p-0 m-0 cursor-pointer"
          onClick={() => {
            const csvContent = `firstName,lastName,email\nJohn,Doe,john.doe@example.com\nJane,Smith,jane.smith@example.com\nAlice,Johnson,alice.johnson@example.com\n`;
            const blob = new Blob([csvContent], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Employee-Upload-Template.csv";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
        >
          <span className="mdi mdi-file-excel"></span> Download Template
        </button>
      </label>
      <div className="flex gap-8 relative">
        <div className="w-[72%] flex items-center space-x-2">
          <div className="flex-1">
            <input
              id="customFileUpload2"
              type="file"
              className="hidden"
              accept=".csv"
              onChange={(e) => {
                uploadPDF(e.target.files?.[0] || null);
              }}
            />
            <label
              htmlFor="customFileUpload2"
              className="block w-full p-2 border border-gray-300 rounded-lg cursor-pointer truncate"
            >
              {pdffiles ? pdffiles.name : "1. Choose CSV file..."}
            </label>
          </div>
          <button
            type="button"
            className="p-2 bg-purple-950 text-white hover:bg-purple-800 flex items-center gap-1  rounded-lg  disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed"
            disabled={pdffiles?.name ? false : true}
            onClick={handleUploadcsv}
          >
            <img src={Upload} alt="image" className=" w-[14px] h-[14px] " /> 2.
            Upload File
          </button>
        </div>
      </div>
      <div className="mt-6 pt-4 pb-8 px-4 border border-gray-200 rounded-lg">
        <label className="text-lg font-bold">Add Individual Employees</label>
        <div className="flex items-end gap-4">
          {/* Input Fields */}
          <form
            onSubmit={EmployeeForm.handleSubmit(onSubmit)}
            className="w-full flex justify-between mt-2"
          >
            {/* First Name */}
            <div className="w-full grid grid-cols-4 gap-x-16">
              <div className="">
                <div className="flex gap-1 items-center w-full">
                  <Label
                    htmlFor="fullName"
                    className="mb-2 block font-bold text-default-600"
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex gap-1 items-center">
                            <span>Full Name</span>
                            
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="w-48 bg-black px-4 text-center">
                          <p>
                            Manually input target employees by inputing them
                            individually or using a .csv import
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                </div>

                <div className="relative">
                  <Input
                    type="text"
                    {...EmployeeForm.register("fullName")}
                    className={cn("pr-10 h-[36px]", {
                      "border-destructive":
                        EmployeeForm.formState.errors.fullName,
                    })}
                    placeholder="Full Name"
                  />
                </div>
                {EmployeeForm.formState.errors.fullName && (
                  <div className="text-destructive mt-2">
                    {EmployeeForm.formState.errors.fullName.message}
                  </div>
                )}
              </div>

              {/* Emial Adress1 */}
              <div className="col-span-2">
                <div className="flex gap-1 items-center w-full">
                  <Label
                    htmlFor="email"
                    className="mb-2 block font-bold text-default-600"
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex gap-1 items-center">
                            <span>Email Address</span>
                            
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="w-48 bg-black px-4 text-center">
                          <p>
                            Manually input target employees by inputing them
                            individually or using a .csv import
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                </div>

                <div className="relative">
                  <Input
                    type="email"
                    {...EmployeeForm.register("email")}
                    className={cn("pr-10 h-[36px]")}
                    placeholder="Email Address"
                  />
                </div>
                {EmployeeForm.formState.errors.email && (
                  <div className="text-destructive mt-2">
                    {EmployeeForm.formState.errors.email.message}
                  </div>
                )}
              </div>

              {/* Add Button */}
              <div className=" flex items-end justify-center">
                <button
                  type="submit"
                  className="py-2 px-4 flex items-center gap-1 bg-purple-950 text-white hover:bg-purple-800 rounded-sm"
                >
                  <img src={Plus} alt="image" className=" w-[14px] h-[14px] " />{" "}
                  Add
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {(EmployeeDetails?.length as number) > 0 && (
        <div className="mt-4">
          <Button
            disabled={isDownloading && downloadType === "csv"}
            onClick={handleDownload}
            className="bg-purple-950 hover:bg-purple-800 text-white flex items-center gap-2"
          >
            {isDownloading && downloadType === "csv" ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-dashed rounded-full animate-spin"></div>
                Exporting...
              </>
            ) : (
              "Export Employees to CSV"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ManualImport;
