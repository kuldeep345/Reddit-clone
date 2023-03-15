import React, { useState } from 'react';
import { Post, postState } from '@/atoms/postsAtom';
import { BsArrowUpCircle, BsArrowDownCircle, BsFillArrowDownCircleFill, BsFillArrowUpCircleFill, BsChat, BsBookmark } from 'react-icons/bs'
import { IoArrowRedoOutline } from 'react-icons/io5'
import moment from 'moment';
import Image from 'next/image';
import { AiOutlineDelete } from 'react-icons/ai';
import ImageLoader from './ImageLoader';
import { MdOutlineError } from 'react-icons/md';
import { useRecoilState } from 'recoil';

type PostItemProps = {
    post: Post;
    userIsCreator: boolean;
    userVoteValue?: number;
    onVote: (post: Post, vote: number, communityId: string) => void;
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
            
        } catch (error: any) {
            setError(error.message)
        }
        setLoadingDelete(false)
    }

    return (
        <div className='flex border border-gray-300 bg-white cursor-pointer' onClick={onSelectPost}>
            <div className="flex flex-col items-center p-2 w-[40px] rounded bg-gray-100">
                {userVoteValue! > 0 ? <BsFillArrowUpCircleFill className={`${userVoteValue! > 0 ? 'text-orange-500' : 'text-gray-400'}`} fontSize={22} onClick={()=>onVote(post , 1 , post.communityId)} />
                    : <BsArrowUpCircle className={`${userVoteValue! > 1 ? 'text-gray-100' : 'text-gray-400'} cursor-pointer`} fontSize={22} onClick={()=>onVote(post, 1 , post.communityId)} />}
                <span className='text-sm text-gray-400'>{post.voteStatus}</span>
                {userVoteValue! < 1 ? <BsFillArrowDownCircleFill className={`${userVoteValue! <= 1  ? 'text-[#4379ff]' : 'text-gray-400'}`} fontSize={22} onClick={()=>onVote(post , -1 , post.communityId)} />
                    : <BsArrowDownCircle className={`${userVoteValue! <= 1 ? 'text-gray-400' : 'text-gray-400'} cursor-pointer`} fontSize={22} onClick={()=>onVote(post, -1 , post.communityId)} />}
            </div>
            <div className='w-full'>
            {error && (
            <div className="bg-red-200 flex gap-1.5 items-center text-red-700 px-4 py-2 rounded relative text-sm" role="alert">
                <MdOutlineError className='text-base'/>
            <span className="font-semibold text-gray-600">{error}</span>
          </div>
        )}
                <div className='p-[10px] flex flex-col gap-2'>
                    <div className='flex gap-0.5 text-xs'>
                        <span className='text-gray-400'>
                            Posted by u/{post.creatorDisplayName}{" "}{moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
                        </span>
                    </div>
                    <h1 className='text-lg font-bold'>{post.title}</h1>
                    <p className='text-[13px] text-gray-800'>{post.body}</p>
                    {post.imageURL && (
                        <div className='relative flex p-2 w-full h-full'>
                            {imageLoader && <ImageLoader />} 
                            <div className={`w-full`}>
                                <Image src={post.imageURL} fill alt='' className='object-contain !w-full !relative !h-[unset]' onLoad={() => setImageLoader(false)} />
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