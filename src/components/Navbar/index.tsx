import Image from 'next/image';
import React , { useState } from 'react';
import SearchInput from './SearchInput';
import Auth from '../Modal/Auth';
import { authModalState } from '@/atoms/authModalAtom';
import { useSetRecoilState } from 'recoil'

type indexProps = {
    
};

const index:React.FC<indexProps> = () => {

    const setAuthModalState = useSetRecoilState(authModalState)
    
    return (
    <div className='h-[54px] py-[6px] px-[12px] bg-white shadow-md flex justify-between items-center'>
        <div className='flex items-center justify-center'>
                <Image src="/reddit.png" height={56} width={120} alt=""/> 
        </div>
        
        <SearchInput/>
        <Auth/>
        <div className='flex justify-center items-center gap-2'>
            <button onClick={()=>setAuthModalState({open:true ,view:"login"})} className='px-8 font-bold rounded-full py-[4px] text-sm text-blue-500 border-[1.6px] border-blue-500'>Log In</button>
            <button  onClick={()=>setAuthModalState({open:true ,view:"signup"})} className='px-8 font-bold rounded-full py-[5px] text-sm bg-blue-500 border-[1.6px] text-white'>Sign Up</button>
        </div>
    </div>
    )
}
export default index;