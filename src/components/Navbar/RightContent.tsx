import { authModalState } from '@/atoms/authModalAtom';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { User } from 'firebase/auth';
import Icons from './Icons';
import UserMenu from './UserMenu';

type RightContentProps = {
    user?:User | null;
};

const RightContent:React.FC<RightContentProps> = ({user}) => {
    const setAuthModalState = useSetRecoilState(authModalState)
    return <div className='flex justify-center items-center'>
        {user ? <Icons/> : <div className='flex justify-center items-center gap-2'>
            <button onClick={()=>setAuthModalState({open:true ,view:"login"})} className='px-8 font-bold rounded-full py-[4px] text-sm text-blue-500 border-[1.6px] border-blue-500'>Log In</button>
            <button  onClick={()=>setAuthModalState({open:true ,view:"signup"})} className='px-8 font-bold rounded-full py-[5px] text-sm bg-blue-500 border-[1.6px] text-white'>Sign Up</button>
        </div>}
        <UserMenu user={user}/>
    </div>
}
export default RightContent;