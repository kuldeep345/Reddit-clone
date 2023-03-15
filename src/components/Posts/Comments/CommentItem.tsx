import { Timestamp } from 'firebase/firestore';
import moment from 'moment';
import * as React from 'react';
import { FaReddit } from 'react-icons/fa';
import { IoArrowDownCircleOutline , IoArrowUpCircleOutline } from 'react-icons/io5';

export type Comment = {
    id:string;
    creatorId:string;
    creatorDisplayText:string;
    communityId:string;
    postId:string;
    postTitle:string;
    text:string;
    createdAt:Timestamp;
}

interface ICommentItemProps {
    comment:Comment;
    onDeleteComment:(comment:Comment) => void
    loadingDelete:boolean;
    userId:string;
}

  
const CommentItem: React.FunctionComponent<ICommentItemProps> = ({comment,loadingDelete,onDeleteComment,userId}) => {

  return (
    <div className='flex w-full relative '>
        <div className='mr-2'>
            <FaReddit fontSize={30} className="text-gray-300"/>
        </div>

     {loadingDelete &&   <div className="absolute top-[25%] text-gray-500 left-[50%] inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"/>           
}
        <div className='flex flex-col gap-1'>
            <div className='flex gap-2 items-center text-xs'>
                <span className='font-bold'>{comment.creatorDisplayText}</span>
                <span className='text-gray-600'>{moment(new Date(comment.createdAt?.seconds * 1000)).fromNow()}</span>
            </div>
            <p className='text-sm'>{comment.text}</p>
            <div className='flex gap-3 items-center cursor-pointer text-gray-500'>
                <IoArrowUpCircleOutline/>
                <IoArrowDownCircleOutline/>
                {userId === comment.creatorId && (
                     <>
                     <button className='text-[13px] hover:text-blue-500'>Edit</button>
                     <button className='text-[13px] hover:text-blue-500' onClick={()=>onDeleteComment(comment)}>Delete</button>
                     </>
                )}
            </div>
        </div>
    </div>
  );
};

export default CommentItem;
