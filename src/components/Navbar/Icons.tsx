import React from 'react';
import { BsArrowUpRightCircle, BsChatDots } from 'react-icons/bs';
import { GrAdd } from 'react-icons/gr'
import { IoFilterCircleOutline, IoNotificationsOutline, IoVideocamOutline } from 'react-icons/io5'
import UserMenu from './UserMenu'


type IconsProps = {

};

const Icons: React.FC<IconsProps> = () => {

    return <div className='flex justify-center items-center'>
        <div className='hidden md:flex items-center justify-center'>
            <div className='flex justify-center items-center mr-1.5 ml-1.5 p-1 rounded-full hover:bg-gray-200'>
                <BsArrowUpRightCircle fontSize={20} />
            </div>
            <div className='flex justify-center items-center mr-1.5 ml-1.5 p-1 rounded-full hover:bg-gray-200'>
                <IoFilterCircleOutline fontSize={22} />
            </div>
            <div className='flex justify-center items-center mr-1.5 ml-1.5 p-1 rounded-full hover:bg-gray-200'>
                <IoVideocamOutline fontSize={22} />
            </div>
        </div>
        <div className='flex justify-center items-center mr-1.5 ml-1.5 p-1 rounded-full hover:bg-gray-200'>
            <BsChatDots fontSize={20} />
        </div>
        <div className='flex justify-center items-center mr-1.5 ml-1.5 p-1 rounded-full hover:bg-gray-200'>
            <IoNotificationsOutline fontSize={20} />
        </div>
        <button className='flex justify-center items-center mr-1.5 ml-1.5 p-1 rounded-full hover:bg-gray-200'>
            <GrAdd fontSize={20} />
        </button>
        

    </div>
}
export default Icons;