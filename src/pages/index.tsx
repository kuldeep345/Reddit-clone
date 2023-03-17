import PageContent from '@/components/Layout/PageContent'
import { NextPage } from 'next'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/firebase/clientApp';
import { useEffect , useState } from 'react'
import { useRecoilValue } from 'recoil';
import { CommunityState } from '@/atoms/communitiesAtom';
import { collection, doc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import usePosts from '@/hooks/usePosts';
import { Post, PostVote } from '@/atoms/postsAtom';
import PostLoader from '@/components/Posts/PostLoader';
import PostItem from '@/components/Posts/PostItem';
import CreatePostLink from '@/components/Community/CreatePostLink';
import useCommunityData from '@/hooks/useCommunityData';
import Recommendations from '@/components/Community/Recommendations';
import Premium from '@/components/Community/Premium';
import PersonalHome from '@/components/Community/PersonalHome';


const Home:NextPage = () => {
  const [user , loadingUser] = useAuthState(auth)
  const [loading , setLoading] = useState(false)
  const { communityStateValue } = useCommunityData()
  const { postsStateValue , setPostsStateValue ,onDeletePost ,onSelectPost ,onVote } = usePosts()
  
  const buildUserHomeFeed = async() => {
    try {
        if(communityStateValue.mySnippets.length){
          const myCommunityIds = communityStateValue.mySnippets.map(snippet => snippet.communityId)
          const postQuery = query(collection(firestore , 'posts') , where('communityId' , "in" , myCommunityIds), limit(10))
          const postDocs = await getDocs(postQuery)
          const posts = postDocs.docs.map(doc => ({
            id:doc.id,
            ...doc.data()
          }));

          setPostsStateValue(prev => ({
            ...prev,
            posts:posts as Post[]
          }))

        }
        else{
          buildNoUserHomeFeed()
        }
    } catch (error) {
      console.log('buildUserHomeFeed' , error)
    }
  };

  const buildNoUserHomeFeed = async() => {
    setLoading(true)
    try {
      const postQuery = query(collection(firestore , "posts"), orderBy("voteStatus","desc"), limit(10))
      const postDocs = await getDocs(postQuery)
      const posts = postDocs.docs.map(doc =>({id:doc.id, ...doc.data()}))
      setPostsStateValue((prev) => ({
        ...prev,
        posts:posts as Post[]
      }))

    } catch (error) {
        console.log('buildNoUserHomeFeed error' , error)
    }
    setLoading(false)
  };

  const getUserPostVotes = async() => {
    try {
      const postIds = postsStateValue.posts.map((post) => post.id)
      const postVotesQuery = query(collection(firestore , `users/${user?.uid}/postVotes`), where('postId' , 'in' , postIds))

      const postVoteDocs = await getDocs(postVotesQuery);
      const postVotes = postVoteDocs.docs.map((doc) => ({
        id:doc.id,
        ...doc.data()
      }))

      setPostsStateValue((prev) => ({
        ...prev,
        postVotes:postVotes as PostVote[]
      }))

    } catch (error) {
      console.log("getuserpostVotes" , error)
    }
  };

  useEffect(() => {
    if(communityStateValue.snippetsFetched) buildUserHomeFeed();
  }, [communityStateValue.snippetsFetched])
  

  useEffect(() => {
    if(!user && !loadingUser) buildNoUserHomeFeed();
  }, [user,loadingUser])
  
  useEffect(() => {
    if(user && postsStateValue.posts.length) getUserPostVotes()

    return ()=>{
      setPostsStateValue(prev=>({
        ...prev,
        postVotes:[]
      }))
    }
  }, [user , postsStateValue.posts ])
  

  return (
    <PageContent>
      <>
      <CreatePostLink/>
      {loading ? (
        <PostLoader/>
      ) : (
        <div className='flex flex-col gap-3'>
          {postsStateValue.posts.map(post=>(
            <PostItem 
              key={post.id}
              post={post}
              onSelectPost={onSelectPost}
              onDeletePost={onDeletePost}
              onVote={onVote}
              userVoteValue={postsStateValue.postVotes.find((item) => item.postId === post.id)?.voteValue}
              userIsCreator={user?.uid === post.creatorId}
              homePage
            />
          ))}
        </div>
      )}
      </>
      <div className='flex flex-col gap-6'>
      <Recommendations/>
      <Premium/>
      <PersonalHome/>
      </div>
    </PageContent>
  )
}

export default Home