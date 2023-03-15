import React, { useState } from 'react';
import CreateCommunityModal from './CreateCommunityModal';
import { AiOutlinePlus } from 'react-icons/ai'
import { useRecoilValue } from 'recoil';
import { CommunityState } from '@/atoms/communitiesAtom';
import MenuItem from './MenuItem';
import { FaReddit } from 'react-icons/fa';
import useDirectory from './useDirectory';

type CommunitiesProps = {
    
};

const Communities:React.FC<CommunitiesProps> = () => {
    const Icon = FaReddit

   
    const mySnippets = useRecoilValue(CommunityState).mySnippets;
    
    return <div>
        
            <CreateCommunityModal />
            <div className='mt-3 mb-4'>
                <h1 className='text-gray-500 font-medium text-xs pl-3' >MODERATING</h1>
            </div>
            {mySnippets.filter(snippet => snippet.isModerator).map((snippet)=>(
                <MenuItem key={snippet.communityId} icon={<Icon className={`text-orange-500 text-[28px] mr-2`}/>} displayText={`r/${snippet.communityId}`} link={`r/${snippet.communityId}`}  imageUrl={snippet.imageURL!}/>
               ))}     

            <div className='mt-6 mb-1'>
                <h1 className='text-gray-500 font-medium text-xs pl-3' >MY COMMUNITIES</h1>
            </div>
                <div className='w-full hover:bg-gray-200'>
                <button className='px-4 py-2.5 inline-flex justify-center items-center text-base '>
                    <AiOutlinePlus fontSize={16} className="mr-1" />
                    Create Community
                </button>
                </div>
               {mySnippets.map((snippet)=>(
                <MenuItem key={snippet.communityId} icon={<Icon className={`text-blue-500 text-[28px] mr-2`}/>} displayText={`r/${snippet.communityId}`} link={`r/${snippet.communityId}`}  imageUrl={snippet.imageURL!}/>
               ))}         
    </div>
}
export default Communities;