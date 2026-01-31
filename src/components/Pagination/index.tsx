import ReactPaginate from 'react-paginate'

type PaginationProps = {
  handleClick: (e: any) => void
  pageCount: number
  pageRange: number
  mariginpage: number
  pageNo: number
}
const Pagination = ({
  handleClick,
  pageCount,
  pageRange,
  mariginpage,
  pageNo,
}: PaginationProps) => {
  return (
    <div className=' '>
      <ReactPaginate
        nextLabel='Next'
        onPageChange={handleClick}
        pageRangeDisplayed={pageRange}
        marginPagesDisplayed={mariginpage}
        pageCount={pageCount}
        previousLabel='Prev'
        pageClassName='min-w-[2rem]  py-1 border border-[#F1F1F1] rounded-lg text-sm text-center cursor-pointer'
        pageLinkClassName='page-link px-3 py-2'
        nextClassName='text-sm font-medium'
        nextLinkClassName={`${
          pageNo === pageCount
            ? 'text-[#696767] pointer-events-none	cursor-not-allowed'
            : 'text-black'
        } text-sm font-medium px-[0.625rem] py-[0.25rem]`}
        breakLabel='...'
        breakClassName='text-sm font-medium'
        breakLinkClassName='page-link'
        containerClassName='flex items-center justify-end gap-[0.4375rem]'
        activeClassName='bg-[#2962FF] text-white border-none'
        renderOnZeroPageCount={null}
        previousLinkClassName={`${
          pageNo === 1
            ? 'text-[#696767] pointer-events-none cursor-not-allowed'
            : 'text-black'
        } text-sm font-medium px-[0.625rem] py-[0.25rem]`}
        forcePage={pageNo - 1}
      />
    </div>
  )
}

export default Pagination
