import React from 'react'
import { FaReddit } from 'react-icons/fa'
import { BsCardImage , BsLink45Deg} from 'react-icons/bs'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase/clientApp'
import { useSetRecoilState } from 'recoil'
import { authModalState } from '@/atoms/authModalAtom'

const CreatePostLink = () => {

    const router = useRouter();
    const [user] = useAuthState(auth);
    const setAuthModalState = useSetRecoilState(authModalState)

    const onClick = () => {
        if(!user){
            setAuthModalState({ open:true , view:'login' });
            return;
        }
        
        const { communityId } = router.query;
        router.push(`/r/${communityId}/submit`)
    }

  return (
    <div className='bg-white h-12 w-full flex justify-between items-center px-4 mb-4'>
      <FaReddit className='text-4xl text-[#c9c9c9]'/>
      <input onClick={onClick} className='w-[76%] py-1.5 text-base outline-none rounded-md border border-slate-100 px-4 bg-gray-100 font-semibold' placeholder='Create Post'/>
      <BsCardImage className='text-2xl text-[#c9c9c9]'/>
      <BsLink45Deg className='text-2xl text-[#c9c9c9]'/>
    </div>
  )
}

export default CreatePostLink
