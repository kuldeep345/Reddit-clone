import * as React from 'react';
import { FaReddit } from 'react-icons/fa';

interface IPersonalHomeProps {
}

const PersonalHome: React.FunctionComponent<IPersonalHomeProps> = (props) => {
  return (
    <div className='flex flex-col w-full bg-white gap-2'>
        <div className='h-12 w-full bg-cover' style={{backgroundImage:'url(/redditPersonalHome.png)'}}/>
        <div className='p-3 flex flex-col gap-4'>
            <div className='flex items-center gap-3'>
            <FaReddit className='text-[50px] text-[#F26E1D]'/>
            <span className='font-semibold'>Home</span>
            </div>

            <p className='text-sm'>Your personal Reddit frontPage. built for you</p>
        <button className='w-full py-1 font-semibold bg-blue-500 text-white rounded-full'>Create Post</button>
        <button className='w-full py-1 font-semibold text-blue-500 border border-blue-500 rounded-full'>Create Community</button>
        </div>        
    </div>
  ) ;
};

export default PersonalHome;
