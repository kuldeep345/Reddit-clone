import { Community, CommunityState } from '@/atoms/communitiesAtom';
import { auth, firestore, storage } from '@/firebase/clientApp';
import useSelectFile from '@/hooks/useSelectFile';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { RiCakeLine } from 'react-icons/ri'
import Image from 'next/image'
import { FaReddit } from 'react-icons/fa';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { useSetRecoilState } from 'recoil';

type AboutProps = {
    communityData: Community;
};

const About: React.FC<AboutProps> = ({ communityData }) => {
    const router = useRouter()
    const [user] = useAuthState(auth)
    const selectedFileRef = useRef<HTMLInputElement>(null);
    const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile()
    const [uploadingImage, setUploadingImage] = useState(false)
    const setCommunityStateValue = useSetRecoilState(CommunityState)

    const onUpdateImage = async () => {
        if(!selectedFile) return
        setUploadingImage(true);
        try {
            const imageRef = ref(storage , `communities/${communityData.id}/image`)
            await uploadString(imageRef , selectedFile , 'data_url');
            const downloadUrl = await getDownloadURL(imageRef)
            await updateDoc(doc(firestore , "communities", communityData.id), {
                imageURL:downloadUrl
            })
            await updateDoc(doc(firestore , 'users' ,`/${user?.uid}/communitySnippets/${communityData.id}`), {
                imageURL:downloadUrl
            })

            setCommunityStateValue(prev => ({
                ...prev,
                currentCommunity: {
                    ...prev.currentCommunity,
                    imageURL:downloadUrl
                } as Community
            }))

        } catch (error) {
            console.log('onUpdateImage error' , error) 
        }
        setUploadingImage(false)
    };

    console.log(user?.uid , communityData.creatorId)

    return (
        <div className='sticky top-[14px] w-full'>
            <div className='flex justify-between bg-blue-500 text-white p-2 rounded-t'>
                <h1 className='font-bold text-sm'>About Community</h1>
                <HiOutlineDotsHorizontal className='text-lg' />
            </div>
            <div className='flex flex-col p-3 bg-white rounded-b'>
                <div className='flex w-full p-2 text-sm font-bold'>
                    <div className='flex flex-col flex-grow'>
                        <span>{communityData.numberOfMembers.toLocaleString()}</span>
                        <span>Members</span>
                    </div>
                    <div className='flex flex-col flex-grow'>
                        <span>1</span>
                        <span>Online</span>
                    </div>
                </div>
                <hr className='bg-gray-100' />
                <div className='flex items-center w-full px-2 pt-4 font-medium text-sm'>
                    <RiCakeLine className='mr-2 text-sm' />
                    {communityData.createdAt && <span>Created on{" "} {moment(new Date(communityData.createdAt?.seconds * 1000)).format("MMM DD, YYYY")}</span>}
                </div>
                <Link href={`/r/${communityData.id}/submit`}>
                    <button className='w-full h-[30px] mt-1 mb-2 bg-blue-600 text-white font-semibold text-sm rounded-full'>Create Post</button>
                </Link>
                <hr className='bg-gray-100' />
               {user?.uid === communityData.creatorId && (<div className='flex flex-col gap-1 pt-2 text-sm'>
                    <span className='font-bold'>Admin</span>
                    <div className='flex justify-between items-center'>
                        <span onClick={()=>selectedFileRef.current?.click()} className='text-blue-500 cursor-pointer hover:underline'>Change Image</span>
                        {communityData.imageURL || selectedFile ? (
                            <div className='relative h-[40px] aspect-square'>
                                <Image src={selectedFile || communityData.imageURL} fill alt='' />
                            </div>
                        ) : (
                            <FaReddit className='text-red-500 mr-2 -mt-1' fontSize={40} />
                        )}
                    </div>
                    {selectedFile && (
                        uploadingImage ? (
                            <div
                                className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                role="status">
                            </div>
                        ) : (
                            <span className='cursor-pointer' onClick={onUpdateImage} >Save Changes</span>
                        )
                    )}
                    <input 
                    id="file-upload"
                    type="file"
                    accept='image/x-png, image/gif, image/jpeg'
                    hidden
                    ref={selectedFileRef}
                    onChange={onSelectFile}
                    />
                </div>
                )}
            </div>
        </div>
    )
}
export default About;