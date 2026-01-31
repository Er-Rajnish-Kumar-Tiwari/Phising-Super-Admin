import { DataTable } from '@/components/Table/data-table'
import React, { useEffect, useState } from 'react'
import { columns } from './columns';
import SearchBar from '@/components/SearchBar';
import { TablePagination } from '@/components/TablePagination';
import Select from 'react-select';
import { useCampaignById } from '@/service/campaign';
import ParticulerReport from './ParticulerReport';
import { Dialog, DialogContent ,DialogHeader, DialogTitle} from '@/components/ui/dialog';
import type { CampaignPagination } from '@/service/campaign/api';

export type UserDetails = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
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

const EmployeeTable = () => {
  const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<CampaignPagination | null>(null);


  const tableParams = {
    id:localStorage.getItem("user") as string,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    // userSubType: params.get('userSubType') || '',
    search: searchQuery,
    // sortBy: params.get('sortBy') || '',
    // sortId: params.get('sortId') || '',
  }
  const {
    data: employeeData,
    isLoading,
    isFetching,
    refetch,
  } = useCampaignById({
    ...tableParams
  })


  useEffect(()=>{
        refetch()
      },[page,pageSize,searchQuery])

      const handlePageChange = (selectedPage: { selected: number }) => {
            setPage(selectedPage.selected + 1);
          };
        
          const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(e.target.value);
          };
        
        

      console.log("employeeData1")
    console.log(employeeData)
  return (
    <div className=' bg-[#EEF5F9]   '>
      <div className=' bg-white rounded-xl'>
        <div className='border-lightGray w-full rounded-xl border'>
          <div>
            <div className='px-[1.56rem]'>
              {' '}
              <h3 className='pt-[1.56rem] text-[1.375rem] font-semibold'>
                Manage Campaigns
              </h3>
              <div className='mb-[1.81rem] mt-[2rem] flex flex-col gap-3 md:flex-row items-center md:justify-between'>
              <div className=' flex items-center justify-between  px-[1.56rem]'>
              <div className='flex w-full items-center space-x-2 text-base font-normal'>
                <p className='text-gray-400 font-extralight'>Show</p>
                <Select
                  defaultValue={pagesizes[0]}
                  options={pagesizes}
                  styles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      height: '2.5rem',
                      border: '1px solid #D6CFCF',
                    }),
                    option: (styles, { isDisabled, isFocused, isSelected }) => ({
                      ...styles,
                      cursor: 'pointer',
                      margin: '0',
                      color: isSelected ? '#ffffff' : '#000000',
                      backgroundColor: isSelected ? '#2962FF' : '#ffffff',
                      ':hover': {
                        backgroundColor: isSelected ? '' : '#2962FF',
                      },
                    }),
                  }}
                  classNamePrefix='select'
                  onChange={(e: any) => {setPageSize(Number(e?.value));
                        setPage(1)
                      }}
                />
                <p className='text-gray-400 font-extralight'>entries</p>
                
                
              </div>
              </div>
                <SearchBar
                  value={searchQuery}
                  handleChnage={handleSearchChange}
                />
              </div>
            </div>

            <div className=' border-lightGray mx-auto w-[95%] mt-10 rounded-xl border'>
            <DataTable
                data={employeeData?.campaigns || []}
                isLoading={isLoading}
                columns={columns.map(col => {
                  if ((col as any).accessorKey === 'CAMPAIGN NAME') {
                    return {
                      ...col,
                      cell: (props: any) => (
                        <div className='flex items-center justify-center w-[200px]'>
                          <span
                            className='cursor-pointer text-blue-600 underline'
                            onClick={() => {
                              setSelectedCampaign(props.row.original);
                              setModalOpen(true);
                            }}
                          >
                            {props.row.original.campaignName}
                          </span>
                        </div>
                      ),
                    };
                  }
                  return col;
                })}
              />

                  {employeeData ?(
                      <></>
                    ):(
                      <>
                        {!isFetching && ( 
                        <div className='flex h-[500px] flex-col items-center justify-center'>
                          <p className='text-lg font-medium'>No matches found</p>
                        </div>
                       )
                    }
                      </>
                    )}

              {/* {data?.data?.length > 0 ? ( */}
                
              {/* ) : (
                !isFetching && ( */}
                  {/* <div className='flex h-[500px] flex-col items-center justify-center'>
                    <p className='text-lg font-medium'>No matches found</p>
                  </div> */}
                {/* )
              )} */}
            </div>

            <div className='flex justify-between items-center'>
                  {/*{employeeData &&
                (
                  <p className='w-1/2 pl-8'>
                  Showing 1 -{' '}
                  {employeeData?.totalCount < 10 ? employeeData?.totalCount : '10'} of{' '}
                  {employeeData?.totalCount} Entries {searchQuery && `(filtered from ${employeeData.total} total entries)`}
                </p>
                )}*/}
            <TablePagination
                  // totalCount={employeeData?.totalCount || 0}
                  totalCount={employeeData?.totalCount as number}
                  pageNo={page}
                  pageSize={pageSize}
                  handleClick={handlePageChange}
                />
            </div>
            
          </div>
        </div>
      </div>
      {/* Modal for campaign details and emails */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        
        <DialogContent className="mb-[10] max-h-[90%] lg:max-w-[90%] overflow-y-scroll p-0">
          {selectedCampaign && (
            <ParticulerReport
              item={{
                ...selectedCampaign,
                startDate: selectedCampaign.startDate ? new Date(selectedCampaign.startDate) : null,
                endDate: selectedCampaign.endDate ? new Date(selectedCampaign.endDate) : null,
                scheduledDateTime: '',
                totalEmailsSent: 0,
                totalOpens: 0,
                totalClicks: 0,
                openRate: 0,
                clickRate: 0,
                deliveryStatus: selectedCampaign.deliveryStatus as any,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EmployeeTable