import { CommunityState } from '@/atoms/communitiesAtom';
import { DirectoryMenuItem, DirectoryMenuState } from '@/atoms/directoryMenuAtom';
import { useRouter } from 'next/router';
import {useEffect} from 'react';
import { FaReddit } from 'react-icons/fa';
import { useRecoilState, useRecoilValue } from 'recoil';

const useDirectory = () => {
    const [directoryState , setDirectoryState] = useRecoilState(DirectoryMenuState)
    const router = useRouter()
    const communiyStateValue = useRecoilValue(CommunityState)

    const onSelectMenuItem = (menuItem:DirectoryMenuItem) => {
        setDirectoryState(prev=>({
            ...prev,
            selectedMenuItem:menuItem
        }))

        if(menuItem.link === '/'){
            router.push('/')
        }   
        else{
            const link = menuItem.link.split('/')
            router.push(`/r/${link[link.length - 1]}`)
        }
     
        if(directoryState.isOpen){
            toggleMenuOpen()
        }
    }

    const toggleMenuOpen = ()=>{
        setDirectoryState(prev => ({
            ...prev,
            isOpen:!directoryState.isOpen
        }))
    }

    useEffect(() => {
      const { currentCommunity } = communiyStateValue;

      setDirectoryState((prev) => ({
        ...prev,
        selectedMenuItem:{
            displayText:`r/${currentCommunity?.id}`,
            link:`r/${currentCommunity?.id}`,
            imageUrl:currentCommunity?.imageURL,
            icon:FaReddit
        }
      }))

    }, [])
    
  
    return { directoryState , toggleMenuOpen , onSelectMenuItem };
};

export default useDirectory;
