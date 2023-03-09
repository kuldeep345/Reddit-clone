import React, { useState } from 'react';
import { Post } from '@/atoms/postsAtom';
import { BsArrowUpCircle, BsArrowDownCircle, BsFillArrowDownCircleFill, BsFillArrowUpCircleFill, BsChat, BsBookmark } from 'react-icons/bs'
import { IoArrowRedoOutline } from 'react-icons/io5'
import moment from 'moment';
import Image from 'next/image';
import { AiOutlineDelete } from 'react-icons/ai';
import ImageLoader from './ImageLoader';

type PostItemProps = {
    post: Post;
    userIsCreator: boolean;
    userVoteValue?: number;
    onVote: () => {};
    onDeletePost: (post: Post) => Promise<boolean>;
    onSelectPost: () => void;
};

const PostItem: React.FC<PostItemProps> = ({
    post,
    userIsCreator,
    userVoteValue,
    onVote,
    onDeletePost,
    onSelectPost
}) => {

    const [imageLoader, setImageLoader] = useState(true)
    const [error, setError] = useState('');
    const [loadingDelete, setLoadingDelete] = useState(false)

    const handleDelete = async () => {
        setLoadingDelete(true)
        try {
            const success = await onDeletePost(post)

            if (!success) {
                throw new Error("Failed to delete post")
            }
            console.log("post was successfully deleted")
        } catch (error: any) {
            setError(error.message)
        }
        setLoadingDelete(false)
    }

    return (
        <div className='flex border border-gray-300 bg-white cursor-pointer' onClick={onSelectPost}>
            <div className="flex flex-col items-center p-2 w-[40px] rounded bg-gray-100">
                {userVoteValue === 1 ? <BsFillArrowUpCircleFill className={`${userVoteValue === 1 ? 'text-gray-100' : 'text-gray-400'}`} fontSize={22} onClick={onVote} />
                    : <BsArrowUpCircle className={`${userVoteValue === 1 ? 'text-gray-100' : 'text-gray-400'} cursor-pointer`} fontSize={22} onClick={onVote} />}
                <span className='text-sm text-gray-400'>{post.voteStatus}</span>
                {userVoteValue === -1 ? <BsFillArrowDownCircleFill className={`${userVoteValue === -1 ? 'text-gray-100' : 'text-gray-400'}`} fontSize={22} onClick={onVote} />
                    : <BsArrowDownCircle className={`${userVoteValue === 1 ? 'text-[#4379ff]' : 'text-gray-400'} cursor-pointer`} fontSize={22} onClick={onVote} />}
            </div>
            <div className='w-full'>
                <div className='p-[10px] flex flex-col gap-2'>
                    <div className='flex gap-0.5 text-xs'>
                        <span className='text-gray-400'>
                            Posted by u/{post.creatorDisplayName}{" "}{moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
                        </span>
                    </div>
                    <h1 className='text-lg font-bold'>{post.title}</h1>
                    <p className='text-[13px] text-gray-800'>{post.body}</p>
                    {post.imageURL && (
                        <div className='flex p-2 w-full max-h-[460px]'>
                            {imageLoader && (<ImageLoader />)}
                            <div className='relative w-full h-[260px] md:h-[460px]'>
                                <Image src={post.imageURL} fill alt='' style={{ objectFit: 'contain' }} onLoad={() => setImageLoader(false)} />
                            </div>
                        </div>
                    )}
                </div>
                <div className='flex mt-1 mb-0.5 text-gray-500 font-semibold'>
                    <div className='flex items-center py-2 px-[10px] rounded hover:bg-gray-200 cursor-pointer'>
                        <BsChat className='mr-1.5 text-sm' />
                        <span className='text-xs'>{post.numberOfComments}</span>
                    </div>
                    <div className='flex items-center py-2 px-[10px] rounded hover:bg-gray-200 cursor-pointer'>
                        <IoArrowRedoOutline className='mr-1.5 text-base' />
                        <span className='text-xs'>Share</span>
                    </div>
                    <div className='flex items-center py-2 px-[10px] rounded hover:bg-gray-200 cursor-pointer'>
                        <BsBookmark className='mr-1.5 text-sm' />
                        <span className='text-xs'>Save</span>
                    </div>
                    {userIsCreator && <div className='flex items-center py-2 px-[10px] rounded hover:bg-gray-200 cursor-pointer' onClick={handleDelete}>
                        {loadingDelete ? (
                            <div
                                className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-400 border-current border-r-transparent align-[-0.125em] text-secondary motion-safe:animate-[spin_0.5s_linear_infinite]"
                                role="status">
                            </div>
                        ) : (
                            <>
                                <AiOutlineDelete className='mr-1.5 text-sm' />
                                <span className='text-xs'>Delete</span>
                            </>
                        )}
                    </div>}
                </div>
            </div>
        </div>
    )
}
export default PostItem;