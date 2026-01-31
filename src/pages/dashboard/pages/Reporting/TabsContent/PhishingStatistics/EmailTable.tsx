import React from 'react';
import { DataTable } from '@/components/Table/data-table';
import { CampaignEmailRecord } from '@/service/campaign/api';
import { ColumnDef } from '@tanstack/react-table';
import TableHeader from '@/components/TableHeader';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import AnimatedProgressProvider from '@/components/CircularProgressBar/AnimatedProgressProvider';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import { TablePagination } from '@/components/TablePagination';
import toast from 'react-hot-toast';

export const emailColumns: ColumnDef<CampaignEmailRecord>[] = [
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <TableHeader column={column} title='EMAIL' className='w-[200px] text-center ' />
    ),
    cell: (props) => (
      <div className='flex items-center justify-center w-[200px]'>
        {props.row.original.email}
      </div>
    ),
  },
  {
    accessorKey: 'deliveryStatus',
    header: ({ column }) => (
      <TableHeader column={column} title='DELIVERY STATUS' className='w-[150px] text-center' />
    ),
    cell: (props) => (
      <div className='flex items-center justify-center w-[150px]'>
        <span className={`px-2 py-1 font-bold rounded-[4px] ${props.row.original.deliveryStatus === 'Finished' ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}>{props.row.original.deliveryStatus}</span>
      </div>
    ),
  },
  {
    accessorKey: 'delivered',
    header: ({ column }) => (
      <TableHeader column={column} title='DELIVERED' className='w-[100px] text-center' />
    ),
    cell: (props) => (
      <div className='flex items-center justify-center w-[100px]'>
        <div className='w-12 h-12'>
          <AnimatedProgressProvider valueStart={0} valueEnd={props.row.original.delivered ? 100 : 0} duration={1.4}>
            {value => {
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
    accessorKey: 'viewed',
    header: ({ column }) => (
      <TableHeader column={column} title='VIEWED' className='w-[100px] text-center' />
    ),
    cell: (props) => (
      <div className='flex items-center justify-center w-[100px]'>
        <div className='w-12 h-12'>
          <AnimatedProgressProvider valueStart={0} valueEnd={props.row.original.viewed ? 100 : 0} duration={1.4}>
            {value => {
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
    accessorKey: 'clicked',
    header: ({ column }) => (
      <TableHeader column={column} title='CLICKED' className='w-[100px] text-center' />
    ),
    cell: (props) => (
      <div className='flex items-center justify-center w-[100px]'>
        <div className='w-12 h-12'>
          <AnimatedProgressProvider valueStart={0} valueEnd={props.row.original.clicked ? 100 : 0} duration={1.4}>
            {value => {
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
];

type EmailTableProps = {
  data: CampaignEmailRecord[];
  isLoading: boolean;
  totalCount: number;
  pageNo: number;
  pageSize: number;
  handlePageChange: (e: { selected: number }) => void;
};

const downloadFile = async (url: string, filename: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const EmailTable: React.FC<EmailTableProps> = ({ data, isLoading, totalCount, pageNo, pageSize, handlePageChange }) => {
  // Get campaignId from first record if available
  const campaignId = data && data.length > 0 ? data[0].campaignId : undefined;

  const handleExport = async (format: 'excel' | 'csv') => {
    if (!campaignId) {
      toast.error('No campaign ID available for export');
      return;
    }
    try {
      const url = `http://195.35.21.108:7001/auth/api/v1/tracking/campaign/${campaignId}/emails/export?format=${format}&pageSize=100`;
      await downloadFile(url, `emails.${format === 'excel' ? 'xlsx' : 'csv'}`);
      toast.success(`${format.toUpperCase()} file downloaded successfully`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(`Failed to download ${format.toUpperCase()} file`);
    }
  };

  const handleCopy = async () => {
    if (!data || data.length === 0) {
      toast.error('No data available to copy');
      return;
    }
    try {
      const header = ['EMAIL', 'DELIVERY STATUS', 'DELIVERED', 'VIEWED', 'CLICKED'];
      const rows = data.map(row => [
        row.email,
        row.deliveryStatus,
        row.delivered ? '100%' : '0%',
        row.viewed ? '100%' : '0%',
        row.clicked ? '100%' : '0%'
      ]);
      const text = [header, ...rows].map(r => r.join('\t')).join('\n');
      
      // Use fallback if clipboard API not available
      if (!navigator.clipboard) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } else {
        await navigator.clipboard.writeText(text);
      }
      toast.success('Data copied to clipboard successfully');
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy data to clipboard');
    }
  };

  return (
    <>
      <div className="dt-buttons flex flex-wrap  justify-start m-2 items-center">
        <Button
          className=" m-2bg-purple-950 text-white hover:bg-purple-800 bg-purple-950"
          onClick={() => handleExport('excel')}
          disabled={!campaignId}
        >
          Excel
        </Button>
        <Button
          className=" m-2 bg-purple-950 text-white hover:bg-purple-800"
          onClick={() => handleExport('csv')}
          disabled={!campaignId}
        >
          CSV
        </Button>
        <Button
         className=" m-2 bg-purple-950 text-white hover:bg-purple-800"
          onClick={handleCopy}
          disabled={!data || data.length === 0}
        >
          Copy
        </Button>
      </div>
      <DataTable data={data} isLoading={isLoading} columns={emailColumns} />
      {(!data || data.length === 0) && (
        <div className="text-center text-gray-500">No email records found.</div>
      )}
      {totalCount > pageSize && (
        <div className="mt-4">
          <TablePagination
            totalCount={totalCount}
            pageNo={pageNo}
            pageSize={pageSize}
            handleClick={handlePageChange}
          />
        </div>
      )}
    </>
  );
};

export default EmailTable; 