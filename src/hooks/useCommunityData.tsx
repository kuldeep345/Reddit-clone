import { useRecoilState, useSetRecoilState } from 'recoil'
import {Community , CommunitySnippet, CommunityState } from '@/atoms/communitiesAtom'
import { useState , useEffect} from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, firestore } from '@/firebase/clientApp'
import { collection, doc, getDoc, getDocs, increment, writeBatch } from 'firebase/firestore'
import { authModalState } from '@/atoms/authModalAtom'
import { Router, useRouter } from 'next/router'

const useCommunityData = () => {
    const [user] = useAuthState(auth)
    const [communityStateValue , setCommunityStateValue] = useRecoilState(CommunityState)
    const setAuthModalState = useSetRecoilState(authModalState)
    const [loading, setLoading] = useState(false)
    const [error , setError] = useState('')
    const router = useRouter()

    const onJoinOrLeaveCommunity = (communityData:Community , isJoined:boolean) => {

        if(!user){
            setAuthModalState({open:true , view:"login"});
            return
        }

        if(isJoined){
            leaveCommunity(communityData.id);
            return;
        }
        joinCommunity(communityData);
    }

    const getMySnippets = async()=>{
        setLoading(true)
        try {
            const snippetDocs = await getDocs(  
                collection(firestore , `users/${user?.uid}/communitySnippets`)
            )
            const snippets = snippetDocs.docs.map((doc)=>({...doc.data()}))
            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets:snippets as Array<CommunitySnippet>,
                snippetsFetched:true
            }))
             } catch (error) {
            console.log("getMySnippets error" , error)
        }
        setLoading(false)
    }

    const joinCommunity = async(communityData:Community)=>{
       try {
        setLoading(true)
        const batch = writeBatch(firestore)

        const newSnippet:CommunitySnippet = {
            communityId:communityData.id,
            imageURL: communityData.imageURL || '',
            isModerator: user?.uid === communityData.creatorId
        }

        batch.set(doc(firestore , `users/${user?.uid}/communitySnippets`, communityData.id), newSnippet);

        batch.update(doc(firestore , "communities" , communityData.id) , {
            numberOfMembers:increment(1)
        })

        await batch.commit();

        setCommunityStateValue(prev => ({
            ...prev,
            mySnippets: [...prev.mySnippets , newSnippet]
        }));
       } catch (error:any) {
        console.log("joinCommunity error" , error)
        setError(error.message)
       } 
       setLoading(false);
    }

    const leaveCommunity = async(communityId:string)=>{
        try {
            setLoading(true)
            const batch = writeBatch(firestore)

            batch.delete(doc(firestore , `users/${user?.uid}/communitySnippets` , communityId))
            batch.update(doc(firestore , "communities" , communityId) , {
                numberOfMembers:increment(-1)
            });

            await batch.commit()

            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets:prev.mySnippets.filter(
                    (item) => item.communityId !== communityId
                )
            }))

        } catch (error:any) {
            console.log('leaveCommunity error' , error.message)
        }
        setLoading(false)
    }

    const getCommunityData = async(communityId:string)=>{
        try {
            const communityDocRef = doc(firestore , 'communities' , communityId)
            const communityDoc = await getDoc(communityDocRef)

            setCommunityStateValue((prev) => ({
                ...prev,
                currentCommunity:{
                    id:communityDoc.id,
                    ...communityDoc.data()
                } as Community
            }))
        } catch (error) {
            console.log('getCommunityData' , error)
        }
    }

    useEffect(() => {
        if(!user) {
            setCommunityStateValue(prev =>({
                ...prev,
                mySnippets:[],
                snippetsFetched:false
            }))
            return
        };

      getMySnippets()
    }, [user])
    
    useEffect(() => {
      const { communityId } = router.query

      if(communityId && !communityStateValue.currentCommunity){
        getCommunityData(communityId as string)
      }
    }, [router.query , communityStateValue.currentCommunity])
    

    return {
        communityStateValue,
        onJoinOrLeaveCommunity,
        loading
    }
}

export default useCommunityData