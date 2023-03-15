import React from 'react';

type PageContentProps = {
    children: React.ReactElement[]
};

const PageContent:React.FC<PageContentProps> = ({children}) => {
    
    return (
    <div className='flex items-center justify-center py-4'>
        <div className='w-[95%] flex justify-between max-w-[900px]'>
            <div className='flex flex-col w-[100%] md:w-[65%] md:mr-[16px]'>{children && children[0]}</div>
            <div className='flex-col hidden md:flex flex-grow'>{children && children[1]}</div>
        </div>
    </div>
    )
}
export default PageContent;