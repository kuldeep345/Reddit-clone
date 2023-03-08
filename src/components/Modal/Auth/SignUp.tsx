import { authModalState } from '@/atoms/authModalAtom';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil'
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/firebase/clientApp';
import { FIREBASE_ERRORS } from '@/firebase/errors';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';

type SignupProps = {

};

const SignUp: React.FC<SignupProps> = () => {

    const setAuthModaState = useSetRecoilState(authModalState)

    const [SignupForm, setSignupForm] = useState({
        email: "",
        password: '',
        confirmPassword: ''
    })

    const [error, setErorr] = useState('')

    const [
        createUserWithEmailAndPassword,
        userCred,
        loading,
        userError,
    ] = useCreateUserWithEmailAndPassword(auth);
    // firebase logic
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (SignupForm.password !== SignupForm.confirmPassword) {
            setErorr('Password do not match')
            return;
        }

       createUserWithEmailAndPassword(SignupForm.email, SignupForm.password).then((user)=>{
        if(user !== undefined){
            setAuthModaState(prev =>({
                ...prev,
                open:false
               }))
        }
       })
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSignupForm(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }

    const createUserDocument = async (user:User) => {
        // await addDoc(collection(firestore , "users") , JSON.parse(JSON.stringify(user)))
        const userDocRef = doc(firestore , "users" , user.uid);
        await setDoc(userDocRef , JSON.parse(JSON.stringify(user)))
    }
        useEffect(() => {
            if(userCred){
                createUserDocument(userCred.user)
            }
        }, [userCred])
        

    return <form onSubmit={onSubmit} className='w-full flex flex-col gap-1.5'>
        <input
            required
            type="email"
            name='email'
            value={SignupForm.email}
            className="formInput"
            placeholder="Email"
            onChange={onChange}
        />
        <input
            required
            type="password"
            name='password'
            value={SignupForm.password}
            className="formInput"
            placeholder="Password"
            onChange={onChange}
        />
        <input
            required
            type="password"
            name='confirmPassword'
            value={SignupForm.confirmPassword}
            className="formInput"
            placeholder="Confirm Password"
            onChange={onChange}
        />
    { (error || userError) && <span className='text-xs text-red-500 text-center'>{error || FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}</span>}
        <button type='submit' className='btn'>
          {loading ? <div
                className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >Loading...</span
                >
            </div> : 'Signup'}
        </button>
        <div className='flex justify-center text-xs font-semibold gap-1 mt-1'>
            <span>Already a redditor?</span>
            <span onClick={() => setAuthModaState((prev) => ({
                ...prev,
                view: "login"
            }))} className='text-blue-500 font-bold cursor-pointer hover:underline'>Login</span>
        </div>
    </form>
}
export default SignUp;