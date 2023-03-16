import PageContent from '@/components/Layout/PageContent'
import { NextPage } from 'next'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import { useEffect , useState } from 'react'
import { useRecoilValue } from 'recoil';
import { CommunityState } from '@/atoms/communitiesAtom';


const Home:NextPage = () => {
  const [user , loadingUser] = useAuthState(auth)
  const [loading , setLoading] = useState(false)
  const communityStateValue = useRecoilValue(CommunityState)

  const buildUserHomeFeed = () => {
    setLoading(true)
    try {
      
    } catch (error) {
      
    }
  };

  const buildNoUserHomeFeed = () => {};

  const getUserPostVotes = () => {};

  useEffect(() => {
    if(!user && !loadingUser) buildNoUserHomeFeed();
  }, [user,loadingUser])
  

  return (
    <PageContent>

    </PageContent>
  )
}
