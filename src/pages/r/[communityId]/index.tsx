import { useEffect } from 'react'
import { Community, CommunityState } from '@/atoms/communitiesAtom';
import CreatePostLink from '@/components/Community/CreatePostLink';
import Header from '@/components/Community/Header';
import NotFound from '@/components/Community/NotFound';
import PageContent from '@/components/Layout/PageContent';
import Posts from '@/components/Posts/Posts';
import { firestore } from '@/firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React from 'react'
import { useSetRecoilState } from 'recoil';
import safeJsonStringify from 'safe-json-stringify'
import About from '@/components/Community/About';

type CommunityPageProps = {
    communityData:Community
};

const CommunityPage:React.FC<CommunityPageProps> = ({communityData}) => {

    const setCommunityStateValue = useSetRecoilState(CommunityState)
 
    if(!communityData){
        return <NotFound/>
    }

    useEffect(() => {
        setCommunityStateValue(prev => ({
            ...prev,
            currentCommunity:communityData
        }))
    }, [])
    

    return (
        <>
         <Header communityData={communityData}/>
         <PageContent>
            <>
            <CreatePostLink/>
            <Posts communityData={communityData}/>
            </>
            <>
            <About communityData={communityData}/>
            </>
         </PageContent>
        </>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext){
    try {
        const communityDocRef = doc(firestore , 'communities' , context.query.communityId as string)

        const communityDoc = await getDoc(communityDocRef)
    
        return {
            props:{
                communityData:communityDoc.exists() ? JSON.parse(safeJsonStringify({id:communityDoc.id, ...communityDoc.data()})) : ''
            }
        }

    } catch (error) {
        console.log('gerserSideProps error' , error)
    }
}

export default CommunityPage; 