import PageContent from '@/components/Layout/PageContent';
import NewPostForm from '@/components/Posts/NewPostForm';
import React from 'react';


type SubmitPostPageProps = {
    
};

const SubmitPostPage:React.FC<SubmitPostPageProps> = () => {
    
    return <PageContent>
        <>
        <div className='py-[14px] border-b border-white'>
            <span>Create a post</span>
        </div>
        <NewPostForm />
        </>
        <></>
    </PageContent>
}
export default SubmitPostPage;