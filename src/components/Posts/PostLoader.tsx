import React from 'react';

type PostLoaderProps = {
    
};

const PostLoader:React.FC<PostLoaderProps> = () => {
    
    return (
       <div className='w-full h-[500px] p-4 bg-white shadow-lg rounded-sm'>

<div role="status" className="w-full h-full rounded animate-pulse ">
   
    <div className="h-2.5 bg-gray-300 rounded-full w-48 mb-4"></div>
    <div className="h-2 bg-gray-300 rounded-full mb-2.5"></div>
    <div className="h-2 bg-gray-300 rounded-full mb-2.5"></div>
    <div className="h-2 bg-gray-300 rounded-full"></div>
    <div className="flex items-center mt-4 space-x-3">
        <div>
            <div className="h-2.5 bg-gray-300 rounded-full w-32 mb-2"></div>
            <div className="w-48 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div> 
        <div className="flex w-full items-center mt-3 justify-center h-[340px] mb-4 bg-gray-300 rounded">
      

    </div>
    <span className="sr-only">Loading...</span>
    </div>
</div>

    )
}
export default PostLoader;