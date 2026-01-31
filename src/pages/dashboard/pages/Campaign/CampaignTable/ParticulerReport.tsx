import React, { FC, useState } from "react";
import AnimatedProgressProvider from "@/components/CircularProgressBar/AnimatedProgressProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  EmailCampaignStatus,
  CampaignEmailRecord,
} from "@/service/campaign/api";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import moment from "moment";
import { useCampaignEmails } from "@/service/campaign";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import { DataTable } from "@/components/Table/data-table";
import { columns } from "./columns";
import EmailTable from "./EmailTable";
import { useMemo } from "react";
import toast from "react-hot-toast";

type Reporting = {
  item: EmailCampaignStatus;
};

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

const ParticulerReport: FC<Reporting> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  //   const [downloadType, setDownloadType] = useState<"excel" | "csv" | null>(
  //     null
  //   );
  //   const isDownloadingRef = useRef(false);
  //   const [downloadTrigger, setDownloadTrigger] = useState(0);
  //   const tableRef = useRef<HTMLTableElement>(null);
  const tableParams = {
    id: localStorage.getItem("user") as string,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    search: searchQuery,
  };

  const {
    data: campaignEmailsData,
    isLoading,
    isFetching,
    refetch,
  } = useCampaignEmails({
    campaignId: item._id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    search: searchQuery,
  });

  const handlePageChange = (selectedPage: { selected: number }) => {
    setPage(selectedPage.selected + 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Calculate click and view rate from email data
  let calculatedClickRate = 0;
  let calculatedViewRate = 0;
  if (
    campaignEmailsData &&
    campaignEmailsData.data &&
    campaignEmailsData.data.length > 0
  ) {
    const total = campaignEmailsData.data.length;
    const clicked = campaignEmailsData.data.filter(
      (email: any) =>
        email.clicked === true || email.clicked === 1 || email.clicked === "1"
    ).length;
    const viewed = campaignEmailsData.data.filter(
      (email: any) =>
        email.viewed === true || email.viewed === 1 || email.viewed === "1"
    ).length;
    calculatedClickRate = Math.round((clicked / total) * 100);
    calculatedViewRate = Math.round((viewed / total) * 100);
  }

  return (
    <div>
      <div className=" border-lightGray bg-cultured rounded-t-lg border-b text-left justify-center">
        <h2 className="lg:p-[1.56rem] text-lg font-semibold leading-5 px-2">
          Campaign Details
        </h2>
      </div>
      <div>
        <div className="p-4">
          <div className="overflow-x-auto w-full ">
            <table className="min-w-full border border-gray-200 shadow-sm rounded-xl w-full">
              <thead className="bg-gray-100 text-gray-700 text-left text-sm">
                <tr>
                  <th className="py-3 px-4 border-b w-[200px] text-center">
                    CAMPAIGN NAME
                  </th>
                  <th className="py-3 px-4 border-b w-[150px] text-center">
                    STATUS
                  </th>
                  <th className="py-3 px-4 border-b w-[180px] text-center">
                    SCHEDULED DATE
                  </th>
                  <th className="py-3 px-4 border-b w-[100px] text-center">
                    EMAIL DELIVERED
                  </th>
                  <th className="py-3 px-4 border-b w-[100px] text-center">
                    EMAIL VIEWED
                  </th>
                  <th className="py-3 px-4 border-b w-[100px] text-center">
                    EMAIL CLICKED
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm bg-gray-50">
                <tr className="hover:bg-gray-100">
                  <td className="py-3 px-4 font-medium cursor-pointer w-[200px] text-center">
                    <div className="flex items-center justify-center w-full">
                      {item.campaignName}
                    </div>
                  </td>
                  <td className="py-3 px-4 w-[150px] text-center">
                    <div className="flex items-center justify-center w-full">
                      <span
                        className={`${
                          item.deliveryStatus === "Finished"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-black"
                        }  px-2 py-1 font-bold rounded-[4px]`}
                      >
                        {item.deliveryStatus}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 w-[180px] text-center">
                    <div className="flex items-center justify-center w-full">
                      {item.startDate && item.endDate ? (
                        <span>{`${moment(item.startDate).format(
                          "DD/MM/YYYY"
                        )} - ${moment(item.endDate).format(
                          "DD/MM/YYYY"
                        )}  `}</span>
                      ) : (
                        <span>{`${moment(item.createdAt).format(
                          "DD/MM/YYYY"
                        )} - ${moment(item.createdAt).format(
                          "DD/MM/YYYY"
                        )}  `}</span>
                      )}
                    </div>
                  </td>
                  <td className="w-[100px] text-center">
                    <div className="flex items-center justify-center w-full">
                      {/* <GreenTick /> */}
                      <div className="w-12 h-12 mx-auto">
                        <AnimatedProgressProvider
                          valueStart={0}
                          valueEnd={
                            item.deliveryStatus === "Finished"
                              ? 100
                              : item.deliveryStatus === "Start"
                              ? 0
                              : 50
                          }
                          duration={1.4}
                        >
                          {(value) => {
                            const roundedValue = Math.round(value);
                            return (
                              <CircularProgressbar
                                value={value}
                                text={`${roundedValue}%`}
                                styles={buildStyles({ pathTransition: "none" })}
                              />
                            );
                          }}
                        </AnimatedProgressProvider>
                      </div>
                    </div>
                  </td>
                  <td className="w-[100px] text-center">
                    <div className="flex items-center justify-center w-full">
                      {/* <GreenTick /> */}
                      <div className="w-12 h-12 mx-auto">
                        <AnimatedProgressProvider
                          valueStart={0}
                          valueEnd={calculatedViewRate}
                          duration={1.4}
                        >
                          {(value) => {
                            const roundedValue = Math.round(value);
                            return (
                              <CircularProgressbar
                                value={value}
                                text={`${roundedValue}%`}
                                styles={buildStyles({ pathTransition: "none" })}
                              />
                            );
                          }}
                        </AnimatedProgressProvider>
                      </div>
                    </div>
                  </td>

                  <td className="w-[100px] text-center">
                    <div className="flex items-center justify-center w-full">
                      {/* <GreenTick /> */}
                      <div className="w-12 h-12 mx-auto">
                        <AnimatedProgressProvider
                          valueStart={0}
                          valueEnd={calculatedClickRate}
                          duration={1.4}
                        >
                          {(value) => {
                            const roundedValue = Math.round(value);
                            return (
                              <CircularProgressbar
                                value={value}
                                text={`${roundedValue}%`}
                                styles={buildStyles({ pathTransition: "none" })}
                              />
                            );
                          }}
                        </AnimatedProgressProvider>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="">
            {/* {' '}
              <h3 className='pt-[1.56rem] text-[1.375rem] font-semibold'>
                Manage Employees
              </h3> */}

            <div className="mx-auto w-[95%] mb-4 mt-4 flex flex-col md:flex-row items-center md:justify-between gap-3">
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
              <div className="flex-1 flex justify-end w-full">
                <SearchBar
                  value={searchQuery}
                  handleChnage={handleSearchChange}
                />
              </div>
            </div>
          </div>

          <div className="border-lightGray mx-auto w-[95%] rounded-xl border shadow-sm p-4 bg-white">
            {/* Export/Copy Buttons UI - outside the table */}
            {campaignEmailsData?.data && campaignEmailsData.data.length > 0 && (
              <div className="flex gap-4 mb-2 mt-2 justify-start">
                <ExportCopyButtons
                  campaignId={campaignEmailsData.data[0].campaignId}
                  data={campaignEmailsData.data}
                />
              </div>
            )}
            <EmailTable
              data={campaignEmailsData?.data || []}
              isLoading={isLoading}
              totalCount={campaignEmailsData?.total || 0}
              pageNo={page}
              pageSize={pageSize}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ExportCopyButtons component
const downloadFile = async (url: string, filename: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const ExportCopyButtons: React.FC<{ campaignId: string; data: any[] }> = ({
  campaignId,
  data,
}) => {
  const handleExport = async (format: "excel" | "csv") => {
    if (!campaignId) {
      toast.error("No campaign ID available for export");
      return;
    }
    try {
      const url = `http://195.35.21.108:7001/auth/api/v1/tracking/campaign/${campaignId}/emails/export?format=${format}&pageSize=100`;
      await downloadFile(url, `emails.${format === "excel" ? "xlsx" : "csv"}`);
      toast.success(`${format.toUpperCase()} file downloaded successfully`);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error(`Failed to download ${format.toUpperCase()} file`);
    }
  };

  const handleCopy = async () => {
    if (!data || data.length === 0) {
      toast.error("No data available to copy");
      return;
    }
    try {
      const header = [
        "EMAIL",
        "DELIVERY STATUS",
        "DELIVERED",
        "VIEWED",
        "CLICKED",
      ];
      const rows = data.map((row) => [
        row.email,
        row.deliveryStatus,
        row.delivered ? "100%" : "0%",
        row.viewed ? "100%" : "0%",
        row.clicked ? "100%" : "0%",
      ]);
      const text = [header, ...rows].map((r) => r.join("\t")).join("\n");

      // Use fallback if clipboard API not available
      if (!navigator.clipboard) {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      } else {
        await navigator.clipboard.writeText(text);
      }
      toast.success("Data copied to clipboard successfully");
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Failed to copy data to clipboard");
    }
  };

  return (
    <>
      <Button
        className="bg-purple-950 hover:bg-purple-700 text-white font-semibold rounded-xl px-4 py-2 text-sm "
        onClick={() => handleExport("excel")}
        disabled={!campaignId}
      >
        Excel
      </Button>
      <Button
        className="bg-purple-950  text-white font-semibold rounded-xl px-4 py-2 text-sm hover:bg-purple-700"
        onClick={() => handleExport("csv")}
        disabled={!campaignId}
      >
        CSV
      </Button>
      <Button
        className="bg-purple-950 text-white font-semibold rounded-xl px-4 py-2 text-sm hover:bg-purple-700"
        onClick={handleCopy}
        disabled={!data || data.length === 0}
      >
        Copy
      </Button>
    </>
  );
};

export default ParticulerReport;
