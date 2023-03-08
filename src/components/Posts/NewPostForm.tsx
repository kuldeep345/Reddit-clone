import React , {useState} from 'react';
import { BiPoll } from 'react-icons/bi';
import { BsLink45Deg , BsMic } from 'react-icons/bs';
import { IoDocumentText , IoImageOutline } from 'react-icons/io5';
import { AiFillCloseCircle } from 'react-icons/ai';
import TabItem from './TabItem'
import TextInputs from './PostForm/TextInputs';
import ImageUpload from './PostForm/ImageUpload';

type NewPostFormProps = {
    
};

const formTabs = [
    {
        title:'Post',
        icon:<IoDocumentText className='text-base'/>
    },
    {
        title:'Images & Video',
        icon:<IoImageOutline className='text-base'/>
    },
    {
        title:'Link',
        icon:<BsLink45Deg className='text-base'/>
    },
    {
        title:'Poll',
        icon:<BiPoll className='text-base'/>
    },
    {
        title:'Talk',
        icon:<BsMic className='text-base'/>
    }
]

export type Tabitem = {
    title:string;
    icon: any;
}

const NewPostForm:React.FC<NewPostFormProps> = () => {

    const [selectedTab , setSelectedTab] = useState(formTabs[0].title)
    const [textInputs , setTextnputs] = useState({
        title:"",
        body:""
    })

    const [selectedFile , setSelectedFile] = useState<string>()
    const [loading , setLoading] = useState(false)

    const handleCreatePost = async () => {}

    const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader()

        if(event.target.files?.[0]){
            reader.readAsDataURL(event.target.files[0]);
        }

        reader.onload = (readerEvent) => {
            if(readerEvent.target?.result) {
                setSelectedFile(readerEvent.target.result as string)
            }
        }
    }

    const onTextChange = (event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { target: {name , value} } = event;
        setTextnputs((prev) => ({
            ...prev,
            [name]:value
        }))
    }

    return <div className='flex flex-col bg-white rounded-md mt-2'>
        <div className='w-full flex'>
            {formTabs.map((item)=>(
                <TabItem item={item} selected={item.title === selectedTab} setSelectedTab={setSelectedTab}/>
            ))}
        </div>
        <div>
        {selectedTab === "Post" && (<TextInputs 
        textInputs={textInputs} 
        handleCreatePost={handleCreatePost} 
        onChange={onTextChange} 
        loading={loading}
        />)}

        {selectedTab === 'Images & Video' && <ImageUpload 
        selectedFile={selectedFile}
        onSelectedImage={onSelectImage}
        setSelectedTab={setSelectedTab}
        setSelectedFile={setSelectedFile}        
        />}
            
        </div>
    </div>
}
export default NewPostForm;