import { CommunityState } from '@/atoms/communitiesAtom';
import PageContent from '@/components/Layout/PageContent';
import NewPostForm from '@/components/Posts/NewPostForm';
import { auth } from '@/firebase/clientApp';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';


type SubmitPostPageProps = {
    
};

const SubmitPostPage:React.FC<SubmitPostPageProps> = () => {

    const [user] = useAuthState(auth)

    const communityStateValue = useRecoilValue(CommunityState)
    console.log('COMMUNITY' , communityStateValue)
    
    return <PageContent>
        <>
        <div className='py-[14px] border-b border-white'>
            <span>Create a post</span>
        </div>
       {user && <NewPostForm user={user}/>}
        </>
        <></>
    </PageContent>
}
export default SubmitPostPage;