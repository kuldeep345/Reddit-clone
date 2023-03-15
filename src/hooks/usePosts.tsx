import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Post, postState, PostVote } from '@/atoms/postsAtom';
import { deleteObject, ref } from 'firebase/storage';
import { auth, firestore, storage } from '@/firebase/clientApp';
import { collection, deleteDoc, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { authModalState } from '@/atoms/authModalAtom';
import { CommunityState } from '@/atoms/communitiesAtom';
import { useRouter } from 'next/router';

const usePosts = () => {
    const router = useRouter()
    const [user] = useAuthState(auth)
    const [postsStateValue, setPostsStateValue] = useRecoilState(postState);
    const modalState = useSetRecoilState(authModalState)
    const currentCommunity = useRecoilValue(CommunityState).currentCommunity

    const onVote = async (
        event:React.MouseEvent<SVGElement, MouseEvent>,
        post: Post, 
        vote: number, 
        communityId: string
        ) => {
            event.stopPropagation()
        //check for a user => if not, open auth modal

        if(!user){
            modalState({
                open:true,
                view:'login'
            })
            return
        }

        try {
            const { voteStatus } = post;
            const existingVote = postsStateValue.postVotes.find(vote => vote.postId === post.id)

            const batch = writeBatch(firestore)
            const updatedPost = { ...post };
            const updatedPosts = [...postsStateValue.posts]
            let updatedPostVotes = [...postsStateValue.postVotes]
            let voteChange = vote;

            if (!existingVote) {
                //add/subtarct to post.votestatus
                // create a new postVote document
                console.log('setting')
                const postVoteRef = doc(collection(firestore, 'users', `${user?.uid}/postVotes`))

                const newVote: PostVote = {
                    id: postVoteRef.id,
                    postId: post.id!,
                    communityId,
                    voteValue: vote
                }
                batch.set(postVoteRef, newVote);

                updatedPost.voteStatus = voteStatus + vote;
                updatedPostVotes = [...updatedPostVotes, newVote]
            }
            //Existing vote - they have voted on the post before
            else {
                const postVoteRef = doc(firestore, 'users', `${user?.uid}/postVotes/${existingVote.id}`)
                //Removing their vote (up => neutral or down => neutral)
                if (existingVote.voteValue === vote) {
                    updatedPost.voteStatus = voteStatus - vote;
                    updatedPostVotes = updatedPostVotes.filter(vote => vote.id !== existingVote.id)
                    //delete the post document
                    batch.delete(postVoteRef)

                    voteChange *= -1
                }
                //flipping their vote (up => down or down => up)
                else {
                    // add/subtract 2 to/from post.votestatus
                    updatedPost.voteStatus = voteStatus + 2 * vote

                    const voteIdx = postsStateValue.postVotes.findIndex(vote => vote.id === existingVote.id);

                    updatedPostVotes[voteIdx] = {
                        ...existingVote,
                        voteValue: vote
                    };
                    // updating the existing postVote document
                    batch.update(postVoteRef, {
                        voteValue:vote
                    });

                    voteChange = 2 * vote
                }
                //update state with updated value
            }
            const postIdx = postsStateValue.posts.findIndex((item) => item.id === post.id)
            updatedPosts[postIdx] = updatedPost
            setPostsStateValue(prev => ({
                ...prev,
                posts:updatedPosts,
                postVotes:updatedPostVotes
            }))

            if(postsStateValue.selectedPost){
                setPostsStateValue((prev)=>({
                    ...prev,
                    selectedPost:updatedPost
                }))
            }
           
            const postRef = doc(firestore , 'posts' , post.id!)
            batch.update(postRef , { voteStatus: voteStatus + voteChange })

            await batch.commit()
        } catch (error) {
            console.log('onvote error')
        }

    };

    const onSelectPost = (post:Post) => { 
        setPostsStateValue((prev)=>({
            ...prev,
            selectedPost:post
        }))
        router.push(`/r/${post.communityId}/comments/${post.id}`)
     };

    const onDeletePost = async (post: Post): Promise<boolean> => {
        try {
            //check if there is an image
            if (post.imageURL) {
                const imageRef = ref(storage, `posts/${post.id}/image`)
                await deleteObject(imageRef)
            }

            //delete post document from firestore
            const postDocRef = doc(firestore, 'posts', post.id!)
            await deleteDoc(postDocRef)
            //update recoil state
            setPostsStateValue((prev) => ({
                ...prev,
                posts: prev.posts.filter((item) => item.id !== post.id)
            }))

            return true
        } catch (error) {
            return false
        }
    };

    const getCommunityPosts = async (communityId:string)=>{
        const postVotesQuery = query(
            collection(firestore , 'users' , `${user?.uid}/postVotes`), where('communityId', "==" , communityId)
        )

        const postVoteDocs = await getDocs(postVotesQuery);
        const postVotes = postVoteDocs.docs.map((doc) => ({
            id:doc.id,
            ...doc.data()
        }))

        setPostsStateValue((prev) => ({
            ...prev,
            postVotes:postVotes as PostVote[]
        }))


    }

    useEffect(() => {
        if(!user || !currentCommunity?.id) return
        getCommunityPosts(currentCommunity?.id)
    }, [user , currentCommunity])
    
    useEffect(() => {
        if(!user){
            setPostsStateValue((prev)=>(({
                ...prev,
                postVotes:[]
            })))
        }
    }, [user])
    

    return {
        postsStateValue,
        setPostsStateValue,
        onVote,
        onSelectPost,
        onDeletePost
    }
}

export default usePosts;