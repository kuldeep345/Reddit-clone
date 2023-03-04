import React from 'react';
import { Fragment } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { signOut, User } from 'firebase/auth'
import { TiHome } from 'react-icons/ti';
import { BiUserCircle, BiLogOut } from 'react-icons/bi';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';
import Communities from './Communities';
import { Disclosure } from '@headlessui/react'



type DirectoryProps = {
  user?: User | null
};

const Directory: React.FC<DirectoryProps> = ({ user }) => {

  const setAuthModalState = useSetRecoilState(authModalState)

  return (
    <div className='relative'>
      <div className="mx-auto rounded-2xl bg-white ">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between">
              <div className='flex items-center justify-center'>
            <div className='flex items-center justify-between gap-1 text-gray-800 hover:border hover:border-gray-200'>
                <TiHome fontSize={24} className="mr-1"/>
                <span className='text-[16px] mt-0.5 hidden lg:flex'>Home</span>
                <FaChevronDown className='text-[12px] mt-1' />
            </div>
            </div>
               
              </Disclosure.Button>
              <Disclosure.Panel className="absolute top-11 bg-white py-4 w-60 rouned-md">
                <Communities/>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      
      </div>
    </div>
  )

}
export default Directory




// <div className='flex items-center justify-center'>
// <div className='flex items-center justify-between gap-1 text-gray-800 hover:border hover:border-gray-200'>
//     <TiHome fontSize={24} className="mr-1"/>
//     <span className='text-[16px] mt-0.5 hidden lg:flex'>Home</span>
//     <FaChevronDown className='text-[12px] mt-1' />
// </div>
// </div>