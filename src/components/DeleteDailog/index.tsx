import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type DeleteType={
    handleDelete:()=>any
}
const DeleteDailog = ({handleDelete}:DeleteType) => {
    // const {handleDelete}=props
    const [isDelete, setIsDelete] = useState(false);
  return (
    <div>
         <div className='flex items-center justify-center w-[180px]'>
    <button
        onClick={() => setIsDelete(true)}
        className="text-red-500 hover:text-red-700"
      >
        ❌
      </button>
      </div>
    <Dialog open={isDelete} onOpenChange={setIsDelete}>
            <DialogContent className='mb-[10]  max-h-[40.6875rem]  lg:max-w-[500px] p-0'>
            
              
              <div className="  flex items-center justify-center p-4">
          <div className=" p-6 max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
            <p className="text-gray-600 mb-6">You will not be able to recover the employee!</p>
            <div className="flex justify-end space-x-4">
              <button
                // onClick={onCancel}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Yes, delete it!
              </button>
            </div>
          </div>
        </div>
              </DialogContent>
          </Dialog>
          </div>
  )
}

export default DeleteDailog