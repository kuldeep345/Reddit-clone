import { authModalState } from '@/atoms/authModalAtom';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import { FIREBASE_ERRORS } from '@/firebase/errors';

type LoginProps = {

};

const Login: React.FC<LoginProps> = () => {

    const setAuthModaState = useSetRecoilState(authModalState)

    const [LoginForm, setLoginForm] = useState({
        email: "",
        password: ''
    })

    const [ signInWithEmailAndPassword , user , loading , error] = useSignInWithEmailAndPassword(auth)

    // firebase logic
    const onSubmit = async(e:React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault()
      await signInWithEmailAndPassword(LoginForm.email , LoginForm.password)
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }

    return <form onSubmit={onSubmit} className='w-full flex flex-col gap-1.5'>
        <input
            required
            type="text"
            name='email'
            className="formInput"
            placeholder="Email"
            value={LoginForm.email}
            onChange={onChange}
            />
        <input
            required
            type="password"
            name="password"
            className="formInput"
            placeholder="Password"
            value={LoginForm.password}
            onChange={onChange}
            />
        <span className='text-red-500 text-center text-xs font-semibold my-2'>
            {FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
        </span>
        <button type='submit' className='btn'>
          {loading ? <div
                className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >Loading...</span
                >
            </div> : 'Login'}
            </button>
        <div className='flex justify-center text-xs font-semibold gap-1 mt-1'>
            <span>New here?</span>
            <span onClick={()=>setAuthModaState((prev)=>({
                ...prev,
                view:"signup"
            }))} className='text-blue-500 font-bold cursor-pointer hover:underline'>SIGN UP</span>
        </div>
    </form>
}
export default Login;