import { CommunityState } from '@/atoms/communitiesAtom';
import About from '@/components/Community/About';
import PageContent from '@/components/Layout/PageContent';
import NewPostForm from '@/components/Posts/NewPostForm';
import { auth } from '@/firebase/clientApp';
import useCommunityData from '@/hooks/useCommunityData';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';


type SubmitPostPageProps = {
    
};

const SubmitPostPage:React.FC<SubmitPostPageProps> = () => {

    const [user] = useAuthState(auth)
    const { communityStateValue } = useCommunityData()

     
    return <PageContent>
        <>
        <div className='py-[14px] border-b border-white'>
            <span>Create a post</span>
        </div>
       {user && <NewPostForm user={user} communityImageUrl={communityStateValue.currentCommunity?.imageURL}/>}
        </>
        <>
        {communityStateValue.currentCommunity && <About communityData={communityStateValue.currentCommunity}/>}
        </>
        <></>
    </PageContent>
}
export default SubmitPostPage;