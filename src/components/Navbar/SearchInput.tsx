import React from 'react';
import { BsSearch } from 'react-icons/bs'

type SearchInputProps = {
    
};

const SearchInput:React.FC<SearchInputProps> = () => {
    
    return <div className='flex justify-center bg-gray-100 items-center gap-3 text-gray-500 m-auto p-3 rounded-full w-[50%]'>
        <BsSearch className='text-base'/>
           <input className='bg-transparent w-full text-sm outline-none placeholder-gray-500' placeholder='Search Reddit'/> 
    </div>
}
export default SearchInput;