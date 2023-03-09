import Image from 'next/image';
import React , { useRef } from 'react';

type ImageUploadProps = {
    selectedFile?:string;
    onSelectedImage:(event:React.ChangeEvent<HTMLInputElement>) => void;
    setSelectedTab:(value:string) => void;
    setSelectedFile: (value:string) => void;
};

const ImageUpload:React.FC<ImageUploadProps> = ({onSelectedImage , setSelectedFile , setSelectedTab , selectedFile}) => {

    const selectedFileRef = useRef<HTMLInputElement>(null)
    
    return <div className='flex items-center justify-center w-full min-h-96 p-4'>
        {selectedFile ? ( 
            <div className='flex flex-col justify-center gap-3 items-center w-full'>
                <div className='relative w-full h-full min-h-[360px]'>
            <Image src={selectedFile} fill style={{objectFit:'contain'}} alt=''/>
                </div>
            <div className='flex gap-3 text-sm'>
                <button onClick={()=>setSelectedTab("Post")} className='bg-blue-500 font-semibold py-1 px-4 rounded-full text-white'>Back to Post</button>
                <button onClick={()=>setSelectedFile("")} className='border border-blue-500 text-blue-500 font-semibold py-1 px-4 rounded-full'>Remove</button>
            </div>
            </div>
        ) : ( 
        <div className='flex w-full h-full items-center justify-center p-[20px] border border-dashed border-gray-200 rounded'>
        <button onClick={()=>selectedFileRef.current?.click()} className='text-sm px-4 py-1 rounded-full font-semibold outline-none text-blue-600 border border-blue-600 hover:bg-blue-100'>Upload</button>
        <input ref={selectedFileRef} type="file" className='hidden' onChange={onSelectedImage}/>
        <img src={selectedFile}/>
        </div>
        )}
    </div>
}
export default ImageUpload;