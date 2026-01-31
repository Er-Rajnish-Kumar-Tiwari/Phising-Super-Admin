import React from 'react'
// import { Image } from '../Image'
import SearchIcon from '../../assets/icons/SearchIcon'
type PropsType = {
  value?: string
  handleChnage: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const SearchBar = ({ handleChnage, value }: PropsType) => {
  return (
    <div className='relative  h-full w-[15.125rem] rounded-[3rem]  border border-black p-2 pl-[0.8125rem] pr-[2.3125rem]'>
      <div className='flex items-center '>
        <div className='pr-2'>
          <SearchIcon />
        </div>
        
        <input
          type='text'
          placeholder='Search...'
          className='text-sm outline-none placeholder:text-xs placeholder:text-black'
          onChange={handleChnage}
          value={value}
        />
      </div>
    </div>
  )
}

export default SearchBar
