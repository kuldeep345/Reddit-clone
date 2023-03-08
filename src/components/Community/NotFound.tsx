import Link from 'next/link';
import React from 'react';

type NotFoundProps = {
    
};

const NotFound:React.FC<NotFoundProps> = () => {
    
    return (
    <div className='flex flex-col justify-center items-center min-h-[60vh] gap-3'>
        Sorry, that community does not exist or has been banned
        <Link href='/'>
            <button className='font-semibold px-4 py-2 bg-blue-500 rounded-full text-white'>Go Home</button>
        </Link>
    </div>
    )
}
export default NotFound;