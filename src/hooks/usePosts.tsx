import React , {useState} from 'react';
import { useRecoilState } from 'recoil';
import { Post, postState, PostVote } from '@/atoms/postsAtom';
import { deleteObject, ref } from 'firebase/storage';
import { auth, firestore, storage } from '@/firebase/clientApp';
import { collection, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const usePosts = () => {
    const [user] = useAuthState(auth)
    const [postsStateValue , setPostsStateValue] = useRecoilState(postState);

    const onVote = async(post:Post , vote:number, communityId:string)=>{

      try {

        const { voteStatus }  = post;
        const exitingVote = postsStateValue.postVotes.find(vote => vote.postId === post.id)

        const batch = writeBatch(firestore)
        const updatePost = {...post}
        const updatedPost = [...postsStateValue.posts]
        let updatedPostVotes = [...postsStateValue.postVotes]
        let voteChange = vote;

        if(!exitingVote){
            const postVoteRef = doc(collection(firestore , "users" , `${user?.uid}/postVotes`))

            const newVote:PostVote = {
                id:postVoteRef.id,
                postId:post.id!,
                communityId,
                voteValue:vote
            }

            batch.set(postVoteRef , newVote)

            updatePost.voteStatus = voteStatus + vote
            updatedPostVotes = [...updatedPostVotes , newVote]
        }

        else {

            if(removingVote) {

            }

            else{

            }

        }

      } catch (error) {
        
      }  
    };

    const onSelectPost = ()=>{};

    const onDeletePost = async(post:Post):Promise<boolean> =>{
        try {
            //check if there is an image
            if(post.imageURL) {
                const imageRef = ref(storage , `posts/${post.id}/image`)
                await deleteObject(imageRef)
            }

            //delete post document from firestore
            const postDocRef = doc(firestore , 'posts' , post.id!)
            await deleteDoc(postDocRef)
            //update recoil state
            setPostsStateValue((prev) => ({
                ...prev,
                posts:prev.posts.filter((item) => item.id !== post.id)
            }))

            return true
        } catch (error) {
            return false
        }
    };
    
    return {
        postsStateValue ,
        setPostsStateValue,
        onVote,
        onSelectPost,
        onDeletePost
    }
}

export default usePosts;