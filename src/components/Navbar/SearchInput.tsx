import { User } from 'firebase/auth';
import React from 'react';
import { BsSearch } from 'react-icons/bs'

type SearchInputProps = {
    user?:User | null;
};

const SearchInput:React.FC<SearchInputProps> = ({user}) => {
    
    return <div className={`flex justify-center bg-gray-100 items-center gap-3 mx-4 text-gray-500 m-auto p-3 rounded-2xl grow`}>
        <BsSearch className='text-base'/>
           <input className='bg-transparent w-full text-sm outline-none placeholder-gray-500' placeholder='Search Reddit'/> 
    </div>
}
export default SearchInput;