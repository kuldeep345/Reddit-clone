import React from 'react';

type TextInputsProps = {
    textInputs:{
        title:string;
        body:string
    };
    onChange:(event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleCreatePost: () => void;
    loading: boolean;
};

const TextInputs:React.FC<TextInputsProps> = ({textInputs , handleCreatePost , loading , onChange}) => {
    
    return <div className='bg-white rounded-b-md w-full h-56 flex flex-col justify-start items-end py-4 px-4 gap-3 text-sm'>
        <input name='title' value={textInputs.title} onChange={onChange} className='w-full text-sm rounded placeholder-gray-500 border border-gray-200 focus:border-gray-500 focus:outline-none pl-4 py-2.5' placeholder='Title'/>
        <textarea name='body' onChange={onChange} className='w-full border h-[100px] border-gray-200 focus:border-gray-500 focus:outline-none p-2 rounded-md' />
        <button className='text-base rounded-full py-1.5 px-8 bg-blue-500 text-white' disabled={!textInputs.title} onClick={handleCreatePost}>{loading ? <div
                className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >Loading...</span
                >
            </div> : 'Post'}</button>
    </div>
}
export default TextInputs;