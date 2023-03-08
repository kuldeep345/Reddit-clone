import React from 'react';
import { Tabitem } from './NewPostForm';

type TabItemProps = {
    item:Tabitem;
    selected:boolean;
    setSelectedTab:React.Dispatch<React.SetStateAction<string>>
};

const TabItem:React.FC<TabItemProps> = ({item , selected , setSelectedTab}) => {
    
    return <div className={`flex justify-center items-center flex-1 py-[14px] cursor-pointer hover:bg-gray-50 ${selected ? 'text-blue-500' : 'text-gray-500'}  ${selected ? 'border-b-2 border-blue-500' : 'border-b border-gray-200'} border-r !border-r-gray-100`} onClick={()=>setSelectedTab(item.title)}>
        <div className='flex items-center h-[20px] mr-1.5'>
            {item.icon}
        </div>
        <span className='text-[12px]'>{item.title}</span>
    </div>
}
export default TabItem;