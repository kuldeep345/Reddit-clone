import PageContent from '@/components/Layout/PageContent';
import PostItem from '@/components/Posts/PostItem';
import { auth, firestore } from '@/firebase/clientApp';
import usePosts from '@/hooks/usePosts';
import * as React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { Post } from '@/atoms/postsAtom';
import About from '@/components/Community/About';
import useCommunityData from '@/hooks/useCommunityData';

interface IPostPageProps {
}

const PostPage: React.FunctionComponent<IPostPageProps> = (props) => {
    const [user] = useAuthState(auth)
    const { postsStateValue, setPostsStateValue , onDeletePost , onVote } = usePosts()
    const router = useRouter()
    const { communityStateValue } = useCommunityData()
    const fetchPost = async(postId:string)=>{
        try {
            const postDocRef = doc(firestore , 'posts' , postId)
            const postDoc = await getDoc(postDocRef)
            setPostsStateValue(prev=>({
                ...prev,
                selectedPost:{ id:postDoc.id , ...postDoc.data() } as Post
            }))
        } catch (error) {
            console.log("fetch error" , error)
        }
    }

    useEffect(() => {   
        const { pid } = router.query;

        if(pid && !postsStateValue.selectedPost){
            fetchPost(pid as string)
        }
    }, [router.query , postsStateValue.selectedPost])
    

  return(
    <PageContent>
        <>
        {postsStateValue.selectedPost && <PostItem 
        post={postsStateValue.selectedPost}
        onVote={onVote}
        onDeletePost={onDeletePost}
        userVoteValue={
            postsStateValue.postVotes.find(item=> item.postId === postsStateValue.selectedPost?.id)?.voteValue
        }
        userIsCreator={user?.uid === postsStateValue.selectedPost?.creatorId}
        />}
     </>
     <>
         {communityStateValue.currentCommunity &&(
         <About communityData={communityStateValue.currentCommunity}/>
         )}
         </>
    </PageContent>
  )
};

export default PostPage;
