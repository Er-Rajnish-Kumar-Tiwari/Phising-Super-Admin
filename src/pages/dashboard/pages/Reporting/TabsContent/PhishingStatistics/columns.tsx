import AnimatedProgressProvider from "@/components/CircularProgressBar/AnimatedProgressProvider";
import TableHeader from "@/components/TableHeader";
import { EmailCampaignStatus } from "@/service/campaign/api";

import type { ColumnDef } from "@tanstack/react-table";

import moment from "moment";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import ParticulerReport from "./ParticulerReport";

export const columns: ColumnDef<EmailCampaignStatus>[] = [
  {
    accessorKey: "CAMPAIGN NAME",
    header: ({ column }) => (
      <TableHeader
        column={column}
        title="CAMPAIGN NAME"
        className="w-[200px] text-center items-center justify-center"
      />
    ),
    cell: (props) => (
      <div className="flex items-center justify-center w-[200px] min-h-[56px]">
        <ParticulerReport item={props.row.original} renderAsLink={true} />
      </div>
    ),
  },
  {
    accessorKey: "STATUS",
    header: ({ column }) => (
      <TableHeader
        column={column}
        title="STATUS"
        className="w-[100px] text-center items-center justify-center"
      />
    ),
    cell: (props) => (
      <div className="flex items-center justify-center w-[100px] min-h-[56px]">
        <span
          className={`${
            props.row.original.deliveryStatus === "Finished"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-black"
          }  px-2 py-1 font-bold rounded-[4px]`}
        >
          {props.row.original.deliveryStatus}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "SCHEDULED DATE",
    header: ({ column }) => (
      <TableHeader
        column={column}
        title="SCHEDULED DATE"
        className="w-[180px] text-center items-center justify-center"
      />
    ),
    cell: (props) => (
      <div className="flex items-center justify-center w-[180px] min-h-[56px]">
        {props.row.original.startDate && props.row.original.endDate ? (
          <span>{`${moment(props.row.original.startDate).format(
            "DD/MM/YYYY"
          )} - ${moment(props.row.original.endDate).format(
            "DD/MM/YYYY"
          )}  `}</span>
        ) : (
          <span>{`${moment(props.row.original.createdAt).format(
            "DD/MM/YYYY"
          )} - ${moment(props.row.original.createdAt).format(
            "DD/MM/YYYY"
          )}  `}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "EMAIL DELIVERED",
    header: ({ column }) => (
      <TableHeader
        column={column}
        title="EMAIL DELIVERED"
        className="w-[100px] text-center items-center justify-center"
      />
    ),
    cell: (props) => (
      <div className="flex items-center justify-center w-[100px] min-h-[56px]">
        <div className="w-12 h-12">
          <AnimatedProgressProvider
            valueStart={0}
            valueEnd={
              props.row.original.deliveryStatus === "Finished"
                ? 100
                : props.row.original.deliveryStatus === "Start"
                ? 0
                : 50
            }
            duration={1.4}
            // easingFunction={easeQuadInOut}
            // repeat
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
    ),
  },
  {
    accessorKey: "EMAIL VIEWED",
    header: ({ column }) => (
      <TableHeader
        column={column}
        title="EMAIL VIEWED"
        className="w-[100px] text-center items-center justify-center"
      />
    ),
    cell: (props) => (
      <div className="flex items-center justify-center w-[100px] min-h-[56px]">
        <div className="w-12 h-12">
          <AnimatedProgressProvider
            valueStart={0}
            valueEnd={
              props.row.original.openRate > 100
                ? 100
                : props.row.original.openRate || 0
            }
            duration={1.4}
          >
            {(value) => {
              const safeValue = value > 100 ? 100 : Math.round(value);

              return (
                <CircularProgressbar
                  value={safeValue}
                  text={`${safeValue}%`}
                  styles={buildStyles({
                    pathTransition: "none",
                  })}
                />
              );
            }}
          </AnimatedProgressProvider>
        </div>
      </div>
    ),
  },
  {
  accessorKey: "EMAIL CLICKED",
  header: ({ column }) => (
    <TableHeader
      column={column}
      title="EMAIL CLICKED"
      className="w-[100px] text-center items-center justify-center"
    />
  ),
  cell: (props) => {
    const rate =
      props.row.original.openRate > 100
        ? 100
        : props.row.original.openRate || 0;

    return (
      <div className="flex items-center justify-center w-[100px] min-h-[56px]">
        <div className="w-12 h-12">
          <AnimatedProgressProvider
            valueStart={0}
            valueEnd={rate}
            duration={1.4}
          >
            {(value) => {
              const safeValue = value > 100 ? 100 : Math.round(value);

              return (
                <CircularProgressbar
                  value={safeValue}
                  text={`${safeValue}%`}
                  styles={buildStyles({ pathTransition: "none" })}
                />
              );
            }}
          </AnimatedProgressProvider>
        </div>
      </div>
    );
  },
},

];
