import { Community } from '@/atoms/communitiesAtom';
import { useState, useEffect } from 'react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { firestore } from '@/firebase/clientApp';
import useCommunityData from '@/hooks/useCommunityData';
import ImageLoader from '../Posts/ImageLoader';
import Link from 'next/link';
import Image from 'next/image';
import { FaReddit } from 'react-icons/fa';

interface IRecommendationsProps {

}

const Recommendations: React.FunctionComponent<IRecommendationsProps> = (props) => {

    const [communities, setCommunnities] = useState<Community[]>([])
    const [loading, setLoading] = useState(false)
    const { communityStateValue, onJoinOrLeaveCommunity } = useCommunityData()
    console.log(communities)

    const getCommunityRecommendations = async () => {
        try {
            const communityQuery = query(collection(firestore, "communities"), orderBy("numberOfMembers", "desc"), limit(5))

            const communityDocs = await getDocs(communityQuery);
            const communities = communityDocs.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setCommunnities(communities as Community[])
        } catch (error) {
            console.log('getCommunityRecommendations error', error)
        }
    }

    useEffect(() => {
        getCommunityRecommendations();
    }, [])


    return (
        <div className='flex flex-col rounded border border-gray-300 bg-white'>
            <div className=' text-white h-[70px] rounded-b font-bold bg-cover' style={{ backgroundImage: "url(/recCommsArt.png)" }}>
                <div className='flex items-end bg-gradient-to-t from-gray-700 py-[6px] px-[10px] to-transparent w-full h-full'>
                    <span>Top Comments</span>
                </div>
            </div>
            <div className='flex flex-col'>
                {loading ? <ImageLoader /> : (
                    <>
                        {communities.map((item, index) => {
                            const isJoined = !!communityStateValue.mySnippets.find((snippet) => snippet.communityId === item.id);

                            return (
                                <Link key={item.id} href={`/r/${item.id}`}>
                                    <div className='flex items-center text-sm rounded-b bg-white border-gray-200 py-[10px] px-[12px]'>
                                        <div className='w-[80%] flex items-center'>
                                            <div className='w-[15%]'>
                                                <span>{index + 1}</span>
                                            </div>
                                            <div className='flex items-center w-[80%]'>
                                                {item.imageURL ? (
                                                    <Image
                                                        src={item.imageURL}
                                                        fill
                                                        alt=''
                                                        className='!relative rounded-full !w-[28px] !h-[28px] aspect-square mr-2'
                                                    />
                                                ) : (
                                                    <FaReddit fontSize={30} className='text-orange-500 mr-2' />
                                                )}
                                              <span className='overflow-hidden text-ellipsis whitespace-nowrap'> {`r/${item.id}`}</span> 
                                            </div>
                                        </div>
                                        <div>
                                            <button 
                                            className={`h-[24px] w-16 font-semibold rounded-full text-xs ${isJoined ? 'text-blue-500 border border-blue-500' : 'bg-blue-500 text-white'}`}
                                            onClick={e=> {
                                                e.stopPropagation()
                                                onJoinOrLeaveCommunity(item , isJoined)
                                            }}
                                            >
                                                {isJoined ? 'Joined' : 'Join'}
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                        <div className='py-[10px] px-[20px] w-full'>
                            <button className='h-[30px] w-[100%] bg-blue-500 text-white rounded-full'>
                                View All
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Recommendations;
