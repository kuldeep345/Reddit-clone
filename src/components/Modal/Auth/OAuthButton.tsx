import React , { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/firebase/clientApp';
import { doc, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';

type OAuthButtonProps = {
    
};

const OAuthButton:React.FC<OAuthButtonProps> = () => {

    const [signInWithGoogle , userCred , loading , error] = useSignInWithGoogle(auth)

    const createUserDocument = async (user:User) => {
       const userDocRef = doc(firestore , "users" , user.uid);
       await setDoc(userDocRef , JSON.parse(JSON.stringify(user)))
    }
        useEffect(() => {
            if(userCred){
                createUserDocument(userCred.user)
            }
        }, [userCred])
    
    return <div className='flex flex-col w-full'>
        <button className="googlebtn" onClick={()=>signInWithGoogle()}>
             {loading ? <div
                className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
                {/* <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >Loading...</span
                > */}
            </div> : ( <div className='inline-flex items-center justify-center gap-3'><FcGoogle className='text-xl'/>Continue with Google</div>)} </button>
        <button className="googlebtn">Some Other Provider</button>
        {error && <span className='my-2 text-xs text-center text-red-500'>{error.message}</span>}
    </div>
}
export default OAuthButton;