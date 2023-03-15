import { authModalState } from '@/atoms/authModalAtom';
import * as React from 'react';
import { useSetRecoilState } from 'recoil';

interface IAuthButtonsProps {
}

const AuthButtons: React.FunctionComponent<IAuthButtonsProps> = (props) => {
    const setAuthModalState = useSetRecoilState(authModalState)
  return(
     <div className='flex w-min justify-center items-center'>
          <div className='flex  w-min justify-center items-center gap-2'>
            <button onClick={()=>setAuthModalState({open:true ,view:"login"})} className='w-24  font-bold rounded-full py-[4px] text-sm text-blue-500 border-[1.6px] border-blue-500'>Log In</button>
            <button  onClick={()=>setAuthModalState({open:true ,view:"signup"})} className='w-24  font-bold rounded-full py-[5px] text-sm bg-blue-500 border-[1.6px] text-white'>Sign Up</button>
        </div>
    </div>
  );
};

export default AuthButtons;
