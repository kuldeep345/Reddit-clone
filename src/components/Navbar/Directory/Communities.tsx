import React, { useState } from 'react';
import CreateCommunityModal from './CreateCommunityModal';
import { AiOutlinePlus } from 'react-icons/ai'

type CommunitiesProps = {
    
};

const Communities:React.FC<CommunitiesProps> = () => {

    const [open , setOpen] = useState(false)
    
    return <div>
        
            <CreateCommunityModal open={open} setOpen={setOpen}/>
                <div className='w-full hover:bg-gray-200'>
                <button onClick={()=>setOpen(true)} className='px-4 py-2 inline-flex justify-center items-center text-sm '>
                    <AiOutlinePlus fontSize={16} className="mr-1" />
                    Community Modal
                </button>
                </div>
               
         
    </div>
}
export default Communities;