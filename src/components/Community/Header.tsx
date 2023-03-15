import { Community } from '@/atoms/communitiesAtom';
import useCommunityData from '@/hooks/useCommunityData';
import React from 'react';
import { FaReddit } from 'react-icons/fa';
import Image from 'next/image'

type HeaderProps = {
    communityData: Community
};

const Header: React.FC<HeaderProps> = ({ communityData }) => {
    const { communityStateValue , onJoinOrLeaveCommunity , loading } = useCommunityData();
    const isJoined = !!communityStateValue.mySnippets.find(item=>item.communityId === communityData.id);

    console.log(communityStateValue.currentCommunity)

    return (
        <div className='flex flex-col w-[100%] h-[146px]'>
            <div className='w-full h-1/2 bg-blue-500' />
            <div className='flex w-full justify-center h-1/2 bg-white flex-grow'>
                <div className='w-[95%] flex max-w-[860px]'>
                    {communityStateValue.currentCommunity?.imageURL ? (
                        <div className='!relative -top-3 text-blue-500 border-4 border-white rounded-full object-cover h-[64px] aspect-square overflow-hidden'>

                        <Image 
                        src={communityStateValue.currentCommunity?.imageURL} 
                        alt=""
                        fill
                        className=''
                        />
                        </div>
                    ) : (
                        <FaReddit fontSize={64} className='relative -top-3 text-blue-500 rounded-full border-4 border-white' />
                    )}
                    <div className='flex'>
                    <div className='flex flex-col py-[10px] px-4'>
                        <span className='font-bold text-lg'>{communityData.id}</span>
                        <span className='font-semibold text-xs text-gray-400'>r/{communityData.id}</span>
                    </div>
                    <button 
                    className='h-[30px] mt-3 bg-blue-500 px-6 rounded-full text-sm text-white font-semibold'
                    onClick={()=>onJoinOrLeaveCommunity(communityData , isJoined)}
                    > {loading ? <div
                        className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status">
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                        >Loading...</span>
                    </div> : <span>{isJoined ? 'Joined' : 'Join'}</span>}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Header;