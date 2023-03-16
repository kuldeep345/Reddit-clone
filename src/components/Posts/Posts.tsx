import { Community } from '@/atoms/communitiesAtom';
import { Post } from '@/atoms/postsAtom';
import { auth, firestore } from '@/firebase/clientApp';
import usePosts from '@/hooks/usePosts';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import PostItem from './PostItem';
import PostLoader from './PostLoader';

type PostsProps = {
    communityData: Community
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
    const [user] = useAuthState(auth)
    const [loading, setLoading] = useState(false)
    const { postsStateValue, setPostsStateValue, onDeletePost, onSelectPost, onVote } = usePosts()

    const getPosts = async () => {
        try {
            setLoading(true)
            const postsQuery = query(collection(firestore, "posts"), where("communityId", "==", communityData.id), orderBy("createdAt", "desc"));

            const postDocs = await getDocs(postsQuery)

            const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

            setPostsStateValue(prev => ({
                ...prev,
                posts: posts as Post[]
            }))

        } catch (error: any) {
            console.log("getPosts error", error.message)
        }
        setLoading(false)
    }

    useEffect(() => {
        getPosts()
    }, [communityData])


    return (
        <>
            {loading ? (
                <PostLoader />
            ) : (
                <div className='flex flex-col gap-2'>
                    {postsStateValue.posts.map(item => (
                        <PostItem
                            key={item.id}
                            post={item}
                            userIsCreator={user?.uid === item.creatorId}
                            userVoteValue={postsStateValue.postVotes.find((vote) => vote.postId === item.id)?.voteValue} 
                            onVote={onVote}
                            onSelectPost={onSelectPost}
                            onDeletePost={onDeletePost} />
                    ))}
                </div>
            )}
        </>
    )
}
export default Posts;