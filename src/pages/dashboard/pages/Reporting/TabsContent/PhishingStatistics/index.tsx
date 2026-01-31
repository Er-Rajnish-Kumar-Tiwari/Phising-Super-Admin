import SearchBar from "@/components/SearchBar";
import { DataTable } from "@/components/Table/data-table";
import { TablePagination } from "@/components/TablePagination";
import { useGetEmployeeMainList } from "@/service/employee";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { pagesizes } from "../../constants";
import { columns } from "./columns";
import { useDownloadExcelOrcsv, useReportingById } from "@/service/campaign";
import {
  createCSVFileDownloadableLink,
  createExcelFileDownloadbleLink,
} from "@/constants/utils";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

const PhishingStatistic = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadType, setDownloadType] = useState<"excel" | "csv" | null>(
    null
  );
  const isDownloadingRef = useRef(false);
  const [downloadTrigger, setDownloadTrigger] = useState(0);
  const tableRef = useRef<HTMLTableElement>(null);
  const tableParams = {
    id: localStorage.getItem("user") as string,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    search: searchQuery,
  };

  // const { data: employeeData, isLoading, isFetching, refetch } = useGetEmployeeMainList({
  //   ...tableParams,
  // });

  const {
    data: ReportingData,
    isLoading,
    isFetching,
    refetch,
  } = useReportingById({
    ...tableParams,
  });

  const { isFetching: isDownloading, refetch: refetchDownload } =
    useDownloadExcelOrcsv(
      {
        ...tableParams,
        format: downloadType || "excel",
      }
    );

  useEffect(() => {
    refetch();
  }, [page, pageSize, searchQuery]);

  useEffect(() => {
    if (downloadType && !isDownloadingRef.current) {
      isDownloadingRef.current = true;
      refetchDownload()
        .then(({ data }: { data: any }) => {
          if (data) {
            if (downloadType === "excel") {
              createExcelFileDownloadbleLink({
                data: data,
                fName: "email-tracking.xlsx",
              });
            } else if (downloadType === "csv") {
              createCSVFileDownloadableLink({
                data: data,
                fName: "email-tracking.csv",
              });
            }
          }
        })
        .finally(() => {
          isDownloadingRef.current = false;
          setDownloadType(null);
        });
    }
  }, [downloadTrigger, downloadType, refetchDownload]);

  const handleDownloadExcel = () => {
    setDownloadType("excel");
    setDownloadTrigger((prev) => prev + 1);
  };

  const handleDownloadCSV = () => {
    setDownloadType("csv");
    setDownloadTrigger((prev) => prev + 1);
  };

  const handlePageChange = (selectedPage: { selected: number }) => {
    setPage(selectedPage.selected + 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCopyTableData = async () => {
    if (!tableRef.current) return;

    try {
      const table = tableRef.current;
      let textToCopy = "";

      // Get all header cells
      const headers = table.querySelectorAll("thead th");
      const headerText = Array.from(headers)
        .map((header) => {
          const text = header.textContent?.trim() ?? "";
          return text.padEnd(15, " "); // Pad to 15 characters
        })
        .join("\t"); // Tab-separated

      textToCopy += headerText + "\n"; // Add header row

      // Get all rows
      const rows = table.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        const rowText = Array.from(cells)
          .map((cell) => {
            const text = cell.textContent?.trim() ?? "";
            return text.padEnd(15, " "); // Pad to 15 characters
          })
          .join("\t"); // Tab-separated
        textToCopy += rowText + "\n"; // Add data row
      });

      // Use fallback if clipboard API not available
      if (!navigator.clipboard) {
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      } else {
        await navigator.clipboard.writeText(textToCopy);
      }
      toast.success("Data copied successfully");
      console.log("Copied:", textToCopy);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  console.log("ReportingData");
  console.log(ReportingData);

  return (
    <div className="w-full">
      <div className="flex items-center mb-2">
        <h4 className="text-xl font-medium md:col-span-3">Active Campaigns</h4>
      </div>

      <div>
        <div className="">
          {/* {' '}
              <h3 className='pt-[1.56rem] text-[1.375rem] font-semibold'>
                Manage Employees
              </h3> */}
          <div className="dt-buttons flex flex-wrap">
            <Button
              disabled={isDownloading && downloadType === "excel"}
              className="mr-2 mb-2 bg-purple-950 text-white hover:bg-purple-800"
              onClick={handleDownloadExcel}
            >
              {isDownloading && downloadType === "excel" ? <Loader /> : "Excel"}
            </Button>
            <Button
              disabled={isDownloading && downloadType === "csv"}
              className="mr-2 mb-2 bg-purple-950 text-white hover:bg-purple-800"
              onClick={handleDownloadCSV}
            >
              {isDownloading && downloadType === "csv" ? <Loader /> : "CSV"}
            </Button>
            <Button
              // disabled={isDownloading && downloadType === "csv"}
              className="mr-2 mb-2 bg-purple-950 text-white hover:bg-purple-800"
              onClick={handleCopyTableData}
            >
              Copy
            </Button>
          </div>

          <div className="mx-auto w-[95%] mb-[1.81rem] mt-[2rem] flex flex-col gap-3 md:flex-row items-center md:justify-between">
            <div className=" flex items-center justify-between ">
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
            <SearchBar value={searchQuery} handleChnage={handleSearchChange} />
          </div>
        </div>

        <div className=" border-lightGray mx-auto w-[95%] mt-10 rounded-xl border">
          <div ref={tableRef}>
            <DataTable
              data={ReportingData?.data || []}
              isLoading={isLoading}
              columns={columns}
            />
          </div>

          {ReportingData?.data ? (
            <></>
          ) : (
            <>
              {!isFetching && (
                <div className="flex h-[500px] flex-col items-center justify-center">
                  <p className="text-lg font-medium">No matches found</p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-between items-center">
          {/*{ReportingData && (
            <p className="w-1/2 pl-8">
              Showing 1 -{" "}
              {ReportingData?.total < 10 ? ReportingData?.total : "10"} of{" "}
              {ReportingData?.total} Entries{" "}
              {searchQuery &&
                `(filtered from ${ReportingData.totalCount} total entries)`}
            </p>
          )}*/}
          <TablePagination
            // totalCount={employeeData?.totalCount || 0}
            totalCount={ReportingData?.total as number}
            pageNo={page}
            pageSize={pageSize}
            handleClick={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PhishingStatistic;
