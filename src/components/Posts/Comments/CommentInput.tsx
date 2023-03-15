import { User } from 'firebase/auth';
import * as React from 'react';
import AuthButtons from './AuthButtons';

interface ICommentInputProps {
    commentText: string;
    setCommentText: (value: string) => void;
    user: User;
    createLoading: boolean;
    onCreateComment: (commentText: string) => void;
}

const CommentInput: React.FunctionComponent<ICommentInputProps> = ({
    commentText,
    setCommentText,
    user,
    createLoading,
    onCreateComment,
}) => {
    return (
        <div className='flex flex-col relative w-full'>
            {user ? (
                <>
                <h1 className='mb-1 text-[13px]'>
                    Comment as {""} 
                    <span className='text-[#3182CE]'>{user?.email?.split("@")[0]}</span>
                </h1>
                <textarea
                 value={commentText}
                 onChange={(e) => setCommentText(e.target.value)}
                 placeholder="what are your thoughts"
                 className='w-full text-sm rounded min-h-[160px] pl-3 pr-2 pt-2 pb-[10px] text-gray-500 focus:outline-none bg-white border border-black'
                />
                <div className='absolute left-[1px] flex right-[0.1px] bottom-[1px] justify-end bg-gray-100 py-[6px] px-[8px] rounded'>
                    <button disabled={!commentText.length} onClick={()=>onCreateComment(commentText)} className='h-[26px] w-28 text-white cursor-pointer font-semibold rounded-full bg-blue-300 hover:bg-blue-100'>
                    {createLoading ? <div
                className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
                
            </div> : 'Comment'}
                    </button>
                </div>
             
                </>
            ) : (
                <div className='flex gap-4 items-center justify-between rounded-sm border border-gray-100 p-4 '>
                    <h1 className='font-semibold'>Log in or sign up to leave a comment</h1>
                    <AuthButtons/>
                </div>
            )}
        </div>
    );
};

export default CommentInput;
