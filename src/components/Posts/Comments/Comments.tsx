import { Post, postState } from '@/atoms/postsAtom';
import { firestore } from '@/firebase/clientApp';
import { User } from 'firebase/auth';
import { collection, doc, getDocs, increment, orderBy, query, serverTimestamp, Timestamp, where, writeBatch } from 'firebase/firestore';
import { type } from 'os';
import { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil';
import CommentInput from './CommentInput';
import CommentItem, { Comment } from './CommentItem';

interface ICommentsProps {
  user: User;
  selectedPost: Post | null;
  communityId: string;
}


const Comments: React.FunctionComponent<ICommentsProps> = ({ user, selectedPost, communityId }) => {

  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [loadingDeleteId , setLoadingDeleteId] = useState('')
  const setPostState = useSetRecoilState(postState)

  console.log(fetchLoading)

  const onCreateComment = async (commentText: string) => {
    //update post number of comments + 1
    setCreateLoading(true)
    try {
      const batch = writeBatch(firestore)
      // create a comment document
      const commentDocRef = doc(collection(firestore, 'comments'))

      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split('@')[0],
        communityId,
        postId: selectedPost?.id!,
        postTitle: selectedPost?.title!,
        text: commentText,
        createdAt: serverTimestamp() as Timestamp
      }

      batch.set(commentDocRef, newComment)

      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

      const postDocRef = doc(firestore, "posts", selectedPost?.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(1)
      })
      await batch.commit();
      setCommentText("")
      setComments(prev => [newComment, ...prev])
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1
        } as Post
      }))

    } catch (error) {
      console.log('onCreateComment error', error)
    }
    setCreateLoading(false)
  }


  const onDeleteComment = async (comment: Comment) => { 
    setLoadingDeleteId(comment.id)
    try {
      const batch = writeBatch(firestore);
      const commentDocRef = doc(firestore , 'comments', comment.id)
      batch.delete(commentDocRef)

      const postDocRef = doc(firestore , 'posts' , selectedPost?.id!)
      batch.update(postDocRef , {
        numOfComments:increment(-1)
      })
      await batch.commit()

      setPostState(prev=>({
        ...prev,
        selectedPost:{
          ...prev.selectedPost,
          numberOfComments:prev.selectedPost?.numberOfComments! - 1
        } as Post
      }))

      setComments(prev => prev.filter(item => item.id !== comment.id))

    } catch (error) {
      console.log('on Delete comment' , error)
    }
    setLoadingDeleteId('')
  }

  const getPostComments = async () => { 
    setFetchLoading(true)
    try {
      const commentsQuery = query(collection(firestore , "comments"), where("postId", "==" , selectedPost?.id), orderBy('createdAt' , 'desc'))
      const commentDocs = await getDocs(commentsQuery)
      const comments = commentDocs.docs.map(doc=>({id:doc.id , ...doc.data()}));
      setComments(comments as Comment[])
    } catch (error) {
      console.log("getPostComments error" , error)
    }
    setFetchLoading(false)
  }

  useEffect(() => {
    if(!selectedPost) return;
    getPostComments()
  }, [selectedPost])


  return (
    <div className='bg-white border-b-4 p-2'>
      <div className='flex w-[94%] ml-auto pl-3 pr-1 mb-2 text-sm'>
       {!fetchLoading && <CommentInput
          commentText={commentText}
          setCommentText={setCommentText}
          user={user}
          createLoading={createLoading}
          onCreateComment={onCreateComment}
        />}
      </div>
      <div className='flex flex-col pb-10 gap-6 p-2'>
        {fetchLoading && setLoadingDeleteId.length === 0 ? (
          <>
          <div className="flex gap-4 px-6 flex-col w-full items-center justify-center mt-4 animate-pulse">
        <svg className="w-14 h-14 -mb-2 mr-auto text-gray-300 " aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path></svg>
        <div className="w-[98%] ml-2 h-1.5 bg-gray-300 rounded-sm"></div>
        <div className="w-[70%] ml-2 h-1.5 bg-gray-300 rounded-sm mr-auto"></div>
    </div>    
          <div className="flex gap-4 px-6 flex-col w-full items-center justify-center mt-4 animate-pulse">
        <svg className="w-14 h-14 -mb-2 mr-auto text-gray-300 " aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path></svg>
        <div className="w-[98%] ml-2 h-1.5 bg-gray-300 rounded-sm"></div>
        <div className="w-[70%] ml-2 h-1.5 bg-gray-300 rounded-sm mr-auto"></div>
    </div>    
          <div className="flex gap-4 px-6 flex-col w-full items-center justify-center mt-4 animate-pulse">
        <svg className="w-14 h-14 -mb-2 mr-auto text-gray-300 " aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path></svg>
        <div className="w-[98%] ml-2 h-1.5 bg-gray-300 rounded-sm"></div>
        <div className="w-[70%] ml-2 h-1.5 bg-gray-300 rounded-sm mr-auto"></div>
    </div>    
          </>
        ) : (
          <>
            {comments.length === 0 ? (
              <div className='flex flex-col py-20 justify-center items-center border-t border-gray-100 '>
                <span className='font-bold opacity-[0.3]'>No Comments Yet</span>
              </div>
            ): (
              <>
           { comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} onDeleteComment={onDeleteComment} loadingDelete={loadingDeleteId === comment.id} userId={user?.uid} />
            ))}
              </>
            )}
          </>
        )}

      </div>
    </div>
  )
};

export default Comments;
