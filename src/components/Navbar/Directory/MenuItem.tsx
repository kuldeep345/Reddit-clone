import Image from 'next/image';
import * as React from 'react';
import { IconType } from 'react-icons/lib';
import useDirectory from './useDirectory';
import { FaReddit } from 'react-icons/fa';


interface IMenuItemProps {
    displayText:string;
    link:string;
    icon:IconType;
    imageUrl:string;
}

const MenuItem: React.FunctionComponent<IMenuItemProps> = ({
        displayText,
        link,
        icon,
        imageUrl
}) => {
    const { onSelectMenuItem } = useDirectory()
    const Icon = icon

    console.log(link)
  return (
    <div className='w-[100%] cursor-pointer text-sm hover:bg-gray-200 py-2 px-4' onClick={()=>{
        onSelectMenuItem({displayText , link ,icon ,imageURL:imageUrl})
        }}>
        <div className='flex items-center'>
            {imageUrl ? (
                <Image src={imageUrl} fill alt='' className="!relative !h-8 !w-8 rounded-full mr-2"/>
            ) : (
                <>
                <Icon className={`text-orange-500 text-[28px] mr-2`}/>
                </>
            )}
            <p>{displayText}</p>
        </div>
    </div>
  )
};

export default MenuItem;
