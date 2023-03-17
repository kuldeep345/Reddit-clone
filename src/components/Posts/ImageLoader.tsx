import React from 'react';

type ImageLoaderProps = {
    
};

const ImageLoader:React.FC<ImageLoaderProps> = () => {
    
    return (
        <div role="status" className="absolute top-0 flex w-full items-center justify-center h-full bg-gray-300 rounded-lg animate-pulse z-50 min-h-[400px]">
        </div>
    )
}
export default ImageLoader;