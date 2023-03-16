import React from 'react';
import { FaChevronDown } from 'react-icons/fa'
import { User } from 'firebase/auth'
import Communities from './Communities';
import useDirectory from './useDirectory';
import Image from 'next/image';
import { useRouter } from 'next/router';



type DirectoryProps = {
  user?: User | null
};

const Directory: React.FC<DirectoryProps> = ({ user }) => {

  const { toggleMenuOpen , directoryState} = useDirectory()
  
   const {pathname} = useRouter()

  return (
    <div className='relative z-50'>
      <div className="mx-auto rounded-2xl bg-white ">

            <>
              <button className="flex w-full justify-between">
              <div className='flex items-center justify-center'>
            <div onClick={toggleMenuOpen} className='flex items-center justify-between gap-1 text-gray-800'>
                {directoryState.selectedMenuItem.imageURL ? (
                  <Image src={directoryState.selectedMenuItem.imageURL} fill alt='' className='!relative mr-2 !w-[24px] 1h-[24px] aspect-square' />
                ) : (
                  <directoryState.selectedMenuItem.icon fontSize={24} className={`"mr-1 ${pathname === '/' ? 'text-gray-400' : 'text-blue-500'}`}/>
                )}
                <span className='text-[16px] mt-0.5 hidden lg:flex'>Home</span>
                <FaChevronDown className='text-[12px] mt-1' />
            </div>
            </div>
               
              </button>
             {directoryState.isOpen && <div className="absolute top-11 bg-white py-4 w-60 rouned-md shadow-lg border border-gray-200 rounded-md">
                <Communities/>
              </div>}
            </>
       
      
      </div>
    </div>
  )

}
export default Directory


