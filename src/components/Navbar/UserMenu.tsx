import React from 'react';
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { signOut, User } from 'firebase/auth'
import { FaRedditSquare } from 'react-icons/fa';
import { VscAccount } from 'react-icons/vsc'
import { BiUserCircle, BiLogOut } from 'react-icons/bi';
import { auth } from '@/firebase/clientApp';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';
import { IoSparkles } from 'react-icons/io5';
import { CommunityState } from '@/atoms/communitiesAtom';


type UserMenuProps = {
  user?: User | null
};

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const resetCommunityState = useResetRecoilState(CommunityState)
  const setAuthModalState = useSetRecoilState(authModalState)

  const logout = async ()=>{
    await signOut(auth)
    // resetCommunityState();
  }

  return (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className='text-gray-400'>
          <div className="flex items-center justify-center mx-1">
            {user ? (
              <div className='flex justify-center items-center'>
                <FaRedditSquare fontSize={26} className="mr-1 mt-1" />
             
                <div className='hidden lg:flex text-sm flex-col items-start mr-8 mt-2 ml-1'>
                  <span className='font-bold text-black'>
                     {user?.displayName || user.email?.split("@")[0]}
                  </span>
                  <div className='flex justify-center items-center text-xs'>
                      <IoSparkles className='mr-1 text-red-500'/>
                      <span className='text-gray-400'>1 karma</span>
                  </div>
                </div>
                <FaChevronDown fontSize={10} className='text-black'/>
              </div>
            ) : (
              <div className='flex items-center justify-center'>
                <VscAccount fontSize={24} className='mx-2 mt-1 text-gray-400' />
                <FaChevronDown fontSize={10} className="mt-1" />
              </div>
            )}
          </div>


        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute top-10 right-0 mt-2 w-52 origin-top-right divide-y divide-gray-100 rounded-sm bg-white shadow-lg focus:outline-none">
           {user ? <div>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
                      } group inline-flex w-full items-center font-semibold rounded-sm px-4 py-2 text-sm`}
                  >
                    <BiUserCircle fontSize={20} className="mr-2" />
                    Profile
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={logout}
                    className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
                      } group inline-flex w-full items-center font-semibold rounded-sm px-4 py-2 text-sm`}
                  >
                    <BiLogOut fontSize={20} className="mr-2" />
                    Logout
                  </button>
                )}
              </Menu.Item>
            </div> :  <div>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setAuthModalState({ open:true , view:'login' })}
                    className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
                      } group inline-flex w-full items-center font-semibold rounded-sm px-4 py-2 text-sm`}
                  >
                    <BiLogOut fontSize={20} className="mr-2" />
                    Login / Signup
                  </button>
                )}
              </Menu.Item>
            </div> }
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )

}
export default UserMenu