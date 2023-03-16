import React, { Dispatch, SetStateAction, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { AiOutlineClose, AiFillEye } from 'react-icons/ai'
import { FaUser } from 'react-icons/fa'
import { HiLockClosed } from 'react-icons/hi'
import { doc, getDoc, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
import { firestore, auth } from '@/firebase/clientApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import useDirectory from './useDirectory';


type CreateCommunityModalProps = {
 open:boolean;
 setOpen:Dispatch<SetStateAction<boolean>>
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({ open , setOpen }) => {
   
    const [user] = useAuthState(auth)
    const [communityName, setCommunityName] = useState("");
    const [charsRemaining, setcharsRemaining] = useState(21);
    const [communityType, setCommunityType] = useState("public")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 21) return

        setCommunityName(e.target.value)
        setcharsRemaining(21 - e.target.value.length)
    }

    const onCommunityTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCommunityType(e.target.name)
    }

    const handleCreateCommunity = async () => {
        const format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (format.test(communityName) || communityName.length < 3) {
            setError("Community names must between 3-21 characters, and can only certain letters, numbers or underscored")
            return;
        }

        setLoading(true)

        try {
            const communityDocRef = doc(firestore, 'communities', communityName)

            await runTransaction(firestore, async (transaction) => {

                const communityDoc = await transaction.get(communityDocRef);

                if (communityDoc.exists()) {
                    setError(`Sorry, r/${communityName} is taken. Try another`)
                    throw new Error(`Sorry, r/${communityName} is taken. Try another`);
                }
                // Create community
                transaction.set(communityDocRef, {
                    creatorId: user?.uid,
                    createdAt: serverTimestamp(),
                    numberOfMembers: 1,
                    privacyType: communityType
                })

                transaction.set(doc(firestore , `users/${user?.uid}/communitySnippets`, communityName) , {
                    communityId:communityName,
                    isModerator:true
                });
            });

        } catch (error: any) {
            console.log('handleCreateCommunity error', error)
            setError(error.message)
        }

        setLoading(false)
    }

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => { setOpen(false); setCommunityName(""); setError('') }}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-[32rem] transform overflow-hidden rounded-md bg-white text-left align-middle shadow-xl transition-all">
                                <div className='h-10 flex items-center justify-between py-6 px-4 border-b border-gray-200'>
                                    <h2 className='font-semibold'>Create a community</h2>
                                    <AiOutlineClose className='text-xl cursor-pointer' onClick={() => {setOpen(false); setCommunityName(""); setError('') }} />
                                </div>
                                <div className='flex flex-col gap-7 py-4 px-4'>
                                    <div>
                                        <h2 className='font-semibold'>Name</h2>
                                        <p className='text-xs text-gray-400'>Community names including capitalization cannot be changed</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="relative w-full text-base pl-6 pr-2 py-1.5 rounded-sm border border-gray-200 outline-none">
                                            <p className="absolute top-[20%] left-[12px] text-gray-400" >
                                                r/
                                            </p>
                                            <input className={`w-full h-full outline-none ${charsRemaining === 0 ? 'text-red-500' : 'text-gray-600'}`} maxLength={21} value={communityName} onChange={handleOnChange} />
                                        </div>
                                        {communityName.length > 0 && <p className='text-xs text-red-500'>{error}</p>}
                                        <p className='text-sm text-gray-400'>{charsRemaining} Characters remaning</p>
                                    </div>
                                    <div>
                                        <h2 className='font-semibold'>Community Type</h2>
                                        <div>
                                            <div className='flex gap-3 items-center text-gray-600'>
                                                <input onChange={onCommunityTypeChange} checked={communityType === 'Public'} type="checkbox" id="Public" name="Public" value="Public" />
                                                <FaUser className="text-sm" />
                                                <label className='text-base' htmlFor="Public">Public</label>
                                                <p className='text-xs text-gray-400 -ml-1 mt-1'>Anyone can view, post, and comment to this community</p>
                                            </div>
                                            <div className='flex gap-3 items-center text-gray-600'>
                                                <input onChange={onCommunityTypeChange} checked={communityType === 'Restricted'} type="checkbox" id="Restricted" name="Restricted" value="Restricted" />
                                                <AiFillEye className='text-base' />
                                                <label className='text-base' htmlFor="Restricted">Restricted</label>
                                                <p className='text-xs text-gray-400 -ml-1 mt-1'>Anyone can view this community, but only approved users</p>
                                            </div>
                                            <div className='flex gap-3 items-center text-gray-600'>
                                                <input onChange={onCommunityTypeChange} checked={communityType === 'Private'} className='text-base' type="checkbox" id="Private" name="Private" value="Private" />
                                                <HiLockClosed className="text-base" />
                                                <label className='text-base' htmlFor="Private">Private</label>
                                                <p className='text-xs text-gray-400 -ml-2 mt-1'>Only approved users can view and submit to this community</p>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div className='w-full flex gap-6 py-4 mt-3 items-center justify-end bg-gray-200'>
                                    <div className="w-[60%] flex gap-3 items-center justify-center">
                                        <button onClick={()=>setOpen(false)} className="text-sm font-semibold py-1 px-4 border border-blue-500 text-blue-500 rounded-full">
                                            Cancel
                                        </button>
                                        <button onClick={handleCreateCommunity} className="w-44 text-sm font-semibold py-1.5 px-4 bg-blue-500 text-white rounded-full">
                                            {loading ? <div
                                                className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                role="status">
                                                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                                >Loading...</span>
                                            </div> : 'Create Community'}
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
export default CreateCommunityModal;