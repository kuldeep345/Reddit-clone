import React , {useState} from 'react';
import { BiPoll } from 'react-icons/bi';
import { BsLink45Deg , BsMic } from 'react-icons/bs';
import { IoDocumentText , IoImageOutline } from 'react-icons/io5';
import { AiFillCloseCircle } from 'react-icons/ai';
import TabItem from './TabItem'
import TextInputs from './PostForm/TextInputs';
import ImageUpload from './PostForm/ImageUpload';
import { Post } from '@/atoms/postsAtom';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import { addDoc, collection, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '@/firebase/clientApp';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { MdOutlineError } from 'react-icons/md'
import useSelectFile from '@/hooks/useSelectFile';

type NewPostFormProps = {
    user:User
    communityImageUrl?:string
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

const NewPostForm:React.FC<NewPostFormProps> = ({user,communityImageUrl}) => {
    const router = useRouter()
    const [selectedTab , setSelectedTab] = useState(formTabs[0].title)
    const [textInputs , setTextnputs] = useState({
        title:"",
        body:""
    })

    const { onSelectFile , selectedFile , setSelectedFile } = useSelectFile()
    const [loading , setLoading] = useState(false)
    const [ error , setError ] = useState(false) 

    const handleCreatePost = async () => {
        const { communityId } = router.query
        const newPost:Post = {
            communityId: communityId as string,
            communityImageUrl:communityImageUrl || '',
            creatorId: user?.uid,
            creatorDisplayName: user.email!.split('@')[0],
            title: textInputs.title,
            body: textInputs.body,
            numberOfComments: 0,
            voteStatus: 0,
            createdAt: serverTimestamp() as Timestamp,
        };
        setLoading(true)
        try {
            const postDocRef = await addDoc(collection(firestore , "posts") , newPost);

            if(selectedFile){
                const imageRef = ref(storage , `posts/${postDocRef.id}/image`)
                await uploadString(imageRef , selectedFile , 'data_url')
                const downloadUrl = await getDownloadURL(imageRef)

                await updateDoc(postDocRef , {
                    imageURL:downloadUrl
                })
            }
            router.back()

        } catch (error:any) {
            console.log("handleCreatePost error" , error.message)
            setError(true)
        }
        setLoading(false)
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
                <TabItem key={item.title} item={item} selected={item.title === selectedTab} setSelectedTab={setSelectedTab}/>
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
        onSelectedImage={onSelectFile}
        setSelectedTab={setSelectedTab}
        setSelectedFile={setSelectedFile}        
        />}     
        </div>
        {error && (
            <div className="bg-red-200 flex gap-1.5 items-center text-red-700 px-4 py-2 rounded relative text-sm" role="alert">
                <MdOutlineError className='text-base'/>
            <span className="font-semibold text-gray-600">Error creating post</span>
          </div>
        )}
    </div>
}
export default NewPostForm;