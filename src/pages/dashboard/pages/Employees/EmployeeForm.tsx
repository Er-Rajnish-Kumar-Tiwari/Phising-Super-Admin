import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Symbol from "@/assets/icons/auth/Symbol.svg";
import ManualImport from "./ManualImport";
import DirectoryImport from "./DirectoryImport";
import { TablePagination } from "@/components/TablePagination";
import { DataTable } from "@/components/Table/data-table";
import SearchBar from "@/components/SearchBar";
import { useEmployeeById, useUpdateEmployeeStatus } from "@/service/employee";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import { employeeTableQueries } from "@/service/queryKeys";
import Edit from "@/assets/icons/edit.svg";
import TableHeader from "@/components/TableHeader";
import { EmployeeType, PaginatedItem } from "@/service/employee/api";
import type { ColumnDef } from "@tanstack/react-table";
import DeleteManualEmployee from "./deleteManualEmployee";

const validationSchema = yup.object().shape({
  employeeListName: yup
    .string()
    .matches(
      /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
      "Only alphabets, numbers, and symbols are allowed"
    )
    .test("no-spaces", "Spaces are not allowed", (value: any) => {
      return !/\s/.test(value);
    })
    // .matches(/^[^\s]+$/, "Spaces are not allowed in the name")
    .required("Employee list name is required"),
  fullName: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, "Name must contain only alphabetic characters")
    .nullable()
    .notRequired(),

  email: yup
    .string()
    .email("Invalid email format")
    .nullable()
    .notRequired(),
});

const pagesizes = [
  {
    value: 5,
    label: 5,
  },
  {
    value: 10,
    label: 10,
  },
  {
    value: 20,
    label: 20,
  },
  {
    value: 30,
    label: 30,
  },
  {
    value: 50,
    label: 50,
  },
  {
    value: 100,
    label: 100,
  },
];

type EmployeeFormProps = {
  employeeLsName?: string;
  isUpdate?: boolean;
};

const EmployeeForm = ({
  employeeLsName = "",
  isUpdate = false,
}: EmployeeFormProps) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("manualImport2");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const { mutate: UpdateEmployeeStatus, isLoading: statusLoading } =
    useUpdateEmployeeStatus({
      onSuccess(data) {
        console.log(data);
        const queryKey = employeeTableQueries.getUserList({
          id: localStorage.getItem("user") as string,
          page: page,
          pageSize: pageSize,
          search: "",
        });
        queryClient.invalidateQueries(queryKey);
        setIsOpen(false);
        EmployeeForm.reset({});
      },
    });

  const EmployeeForm = useForm({
    mode: "onSubmit",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      fullName: "",
      employeeListName: isUpdate && isOpen ? (employeeLsName as string) : "",
      email: "",
    },
  });
  console.log("status");
  console.log(isUpdate && isOpen);

  const tableParams = {
    id: localStorage.getItem("user") as string,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    employeeListName:
      EmployeeForm.getValues("employeeListName") ||
      "" ||
      (isUpdate && isOpen ? (employeeLsName as string) : ""),
    search: searchQuery || "",
  };

  const {
    data: employeeData,
    isLoading,
    isFetching,
    refetch,
  } = useEmployeeById(
    {
      ...tableParams,
    },
    { enabled: !!EmployeeForm.getValues("employeeListName") && isOpen }
  );

  const handleSave = () => {
    try {
      if (employeeData?.paginatedData[0]) {
        console.log("emp data");
        UpdateEmployeeStatus({
          employeeId: employeeData?.paginatedData[0].employeeId as number,
        });
      } else {
        UpdateEmployeeStatus({
          userId: localStorage.getItem("user") as string,
          employeeListName: EmployeeForm.getValues("employeeListName"),
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (EmployeeForm.getValues("employeeListName")) {
      refetch();
    }
  }, [page, pageSize, searchQuery]);

  useEffect(() => {
    if (isUpdate && isOpen) {
      EmployeeForm.setValue("employeeListName", employeeLsName);
    }
  }, [isOpen]);

  const manualcolumns: ColumnDef<PaginatedItem>[] = [
    // {
    //   accessorKey: "id",

    //   header: ({ column }) => <TableHeader column={column} title="SR NO" />,
    // cell: ({ row }) => row.index + 1,

    {
  accessorKey: "id",
  header: ({ column }) => (
    <TableHeader
      column={column}
      title="SR NO"
      className="text-center"
    />
  ),
  cell: ({ row }) => (
    <div className="flex items-center justify-center w-full">
      {(page - 1) * pageSize + row.index + 1}
    </div>
  ),
},

    {
  accessorKey: "fullName",
  header: ({ column }) => (
    <TableHeader
      column={column}
      title="FIRST NAME"
      className="text-center"
    />
  ),
  cell: (props) => (
    <div className="flex items-center justify-center w-full text-center">
      {`${props.row.original.employee?.firstName || ""} ${props.row.original.employee?.lastName || ""}`}
    </div>
  ),
},

    {
  accessorKey: "email",
  header: ({ column }) => (
    <TableHeader
      column={column}
      title="EMAIL"
      className="text-center"
    />
  ),
  cell: (props) => (
    <div className="flex items-center justify-center w-full text-center">
      {props.row.original.employee?.email || ""}
    </div>
  ),
},

    {
  accessorKey: "_id",
  header: ({ column }) => (
    <TableHeader
      column={column}
      title="ACTIONS"
      className="text-center"
    />
  ),
  cell: (props) => (
    <div className="flex items-center justify-center gap-2 w-full">
      {props.row.original.employee ? (
        <DeleteManualEmployee
          employeeName={employeeLsName}
          employeeId={props.row.original._id as string}
          employeeArrayId={props.row.original.employee._id as string}
        />
      ) : (
        <span className="text-gray-400">No employee</span>
      )}
    </div>
  ),
},

  ];

  console.log("employeeData");
  console.log(employeeData);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setPage(selectedPage.selected + 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleEmployeeListNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    EmployeeForm.setValue("employeeListName", e.target.value);
    // EmployeeForm.watch("employeeListName");
    EmployeeForm.trigger("employeeListName");
  };
  return (
    <div>
      <div>
        {isUpdate ? (
          <img
            className="cursor-pointer"
            src={Edit}
            onClick={() => setIsOpen(true)}
          />
        ) : (
          <Button
            className=" mt-4 text-lg font-normal bg-purple-950 text-white hover:bg-purple-800 rounded-md px-4 py-6 "
            onClick={() => setIsOpen(true)}
          >
            New Employee List
          </Button>
        )}
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={() => {
          setIsOpen(false);
          EmployeeForm.reset({ employeeListName: "" });
        }}
      >
        <DialogContent className="mb-[10]  overflow-y-scroll  max-h-[40.6875rem]  lg:max-w-[90%] p-0">
          <DialogHeader className="border-lightGray bg-cultured h-[3.875rem] rounded-t-lg border-b text-left justify-center ">
            <DialogTitle className=" lg:p-[1.56rem] text-lg font-semibold leading-5 px-2">
              Employee List
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 bg-white rounded-lg shadow-md">
            {/* Header */}
            <div className="w-full mb-6">
              {/* Input Group */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                {/* Input Group Prepend (Label) */}
                <div className="bg-gray-100 px-4 py-2 border-r border-gray-300">
                  <span className="font-bold">
                    Employee List: <span className="text-red-500">*</span>
                  </span>
                </div>

                {/* Input Field */}
                <input
                  type="text"
                  id="tname2"
                  placeholder="Employee List Name"
                  {...EmployeeForm.register("employeeListName")}
                  onChange={handleEmployeeListNameChange}
                  disabled={isUpdate}
                  className="flex-1 px-4 py-2 outline-none disabled:bg-gray-300"
                  aria-invalid="false"
                />
              </div>
              {EmployeeForm.formState.errors && (
                <div className="text-destructive mt-2">
                  {EmployeeForm.formState.errors.employeeListName?.message}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-4">
                {/* Manually Import Option */}
                <div
                  className="flex items-center space-x-2"
                  data-tooltip-id="manualImportTooltip"
                  data-tooltip-content="Manually import target employees by inputting them individually or using a .csv import."
                >
                  <input
                    type="radio"
                    id="manualImport2"
                    name="importType2"
                    className="form-radio h-4 w-4 text-blue-600"
                    value="manualImport2"
                    checked={selectedOption === "manualImport2"}
                    onChange={() => setSelectedOption("manualImport2")}
                  />
                  <label
                    htmlFor="manualImport2"
                    className="flex items-center space-x-1"
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex gap-1 items-center">
                            <span>Manually Import</span>
                            
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
                  </label>
                </div>
              </div>
            </div>

            {/* Conditionally Render Manual Import UI */}
            {selectedOption === "manualImport2" && (
              <ManualImport
                refetchnew={refetch}
                EmployeeDetails={employeeData?.paginatedData}
                employeeListName={EmployeeForm.getValues("employeeListName")}
                EmployeeForm={EmployeeForm}
                page={page}
                pageSize={pageSize}
              />
            )}

            {selectedOption === "dirImport2" && <DirectoryImport />}

            {/* Data Table */}
            <div className="mb-[1.5rem] w-full mt-[2rem] flex items-center justify-between">
              <div className=" flex items-center justify-between  px-[1.56rem]">
                <div className="flex w-full items-center space-x-2 text-base font-normal">
                  <p className="text-gray-400 font-extralight">Show</p>
                  <Select
                    defaultValue={pagesizes[0]}
                    options={pagesizes}
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        height: "2.5rem",
                        border: "1px solid #D6CFCF",
                      }),
                      option: (styles, { isSelected }) => ({
                        ...styles,
                        cursor: "pointer",
                        margin: "0",
                        color: isSelected ? "#ffffff" : "#000000",
                        backgroundColor: isSelected ? "#2962FF" : "#ffffff",
                        ":hover": {
                          backgroundColor: isSelected ? "" : "#2962FF",
                        },
                      }),
                    }}
                    classNamePrefix="select"
                    onChange={(e: any) => {
                      setPageSize(Number(e?.value));
                      setPage(1);
                    }}
                  />
                  <p className="text-gray-400 font-extralight">entries</p>
                </div>
              </div>
              <SearchBar
                value={searchQuery}
                handleChnage={handleSearchChange}
              />
            </div>

            <div className="border-lightGray w-full mt-10 rounded-xl border text-center">

              <DataTable
              
                data={employeeData?.paginatedData || []}
                isLoading={false}
                columns={manualcolumns}
                // setSortId={setSortId}
              />

              {employeeData?.paginatedData ? (
                <></>
              ) : (
                <>
                  {!isFetching && (
                    <div className="flex h-[50px] flex-col items-center justify-center">
                      <p className="text-lg font-medium">No matches found</p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="my-[1.8rem] flex items-center justify-between  px-[1.56rem]">
              <div className="flex w-full items-center space-x-2 text-base font-normal"></div>
            </div>
            <TablePagination
              totalCount={employeeData?.totalCount as number}
              pageNo={page}
              pageSize={pageSize}
              handleClick={handlePageChange}
            />

            <div className="mt-3 flex justify-center text-center">
              <Button
                type="submit"
                disabled={statusLoading}
                className="btn btn-success btn-lg bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg flex items-center mr-2"
                // onClick={handleSave}
                onClick={() => {
                  // Validate before submitting
                  EmployeeForm.trigger("employeeListName").then((isValid) => {
                    if (isValid) {
                      handleSave();
                    }
                  });
                }}
              >
                  {statusLoading ? "Saving..." : "Save"}
              </Button>
              <Button
                type="button"
                className="btn btn-danger btn-lg bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg flex items-center ml-2"
                onClick={() => {
                  setIsOpen(false);
                  EmployeeForm.reset({});
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeForm;
