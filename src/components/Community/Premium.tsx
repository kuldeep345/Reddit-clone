import * as React from 'react';
import { GiCheckedShield } from 'react-icons/gi'

interface IAppProps {
}

const Premium: React.FunctionComponent<IAppProps> = (props) => {
  return (
    <div className='flex flex-col bg-white rounded p-3 border border-gray-300'>
        <div className='flex'>
            <GiCheckedShield fontSize={26} className='text-orange-500 mt-2'/>
            <div className='flex flex-col gap-2 ml-3'>
                <span className='font-semibold'>Reddit Premium</span>
                <span className='text-sm'>The best Reddit experience, with monthly Coins</span>
            </div>
        </div>
        <button className='h-[30px] bg-orange-500 text-white font-semibold rounded-full mt-3'>
            Try Now
        </button>
    </div>
  );
};

export default Premium;
