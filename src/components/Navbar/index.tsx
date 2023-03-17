import Image from 'next/image';
import React from 'react';
import SearchInput from './SearchInput';
import Auth from '../Modal/Auth';
import RightContent from './RightContent';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import Directory from './Directory/Directory';
import useDirectory from './Directory/useDirectory';
import { defaultMenuItem } from '@/atoms/directoryMenuAtom';

type indexProps = {
    
};

const index:React.FC<indexProps> = () => {
   
    const [user, loading, error] = useAuthState(auth);
    const { onSelectMenuItem } = useDirectory()  

    return (
    <div className='h-[54px] py-[6px] px-[12px] bg-white shadow-md flex justify-between items-center'>
        <div onClick={()=>onSelectMenuItem(defaultMenuItem)} className='flex cursor-pointer items-center justify-center'>
                <Image src="/reddit.png" height={50} width={120} alt=""/> 
        </div>
        <div className='px-4'>
        {user && <Directory/>}
        </div>
        <SearchInput user={user}/>
        <Auth/>
        <RightContent user={user}/>
    </div>
    )
}
export default index;