import Image from 'next/image';
import React from 'react';
import SearchInput from './SearchInput';
import Auth from '../Modal/Auth';
import RightContent from './RightContent';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import Directory from './Directory/Directory';

type indexProps = {
    
};

const index:React.FC<indexProps> = () => {
   
    const [user, loading, error] = useAuthState(auth);
      
    return (
    <div className='h-[54px] py-[6px] px-[12px] bg-white shadow-md flex justify-between items-center'>
        <div className='flex items-center justify-center'>
                <Image src="/reddit.png" height={50} width={120} alt=""/> 
        </div>
        {user && <Directory/>}
        <SearchInput user={user}/>
        <Auth/>
        <RightContent user={user}/>
    </div>
    )
}
export default index;