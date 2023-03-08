import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export interface Community {
    id:string,
    creatorId:string;
    numberOfMembers:number;
    privacyType:"public" | "restricted" | "private";
    createdAt?:Timestamp;
    imageURL?:string
}

export interface CommunitySnippet {
    communityId:string;
    isModerator?:boolean;
    imageUrl?:string
}

interface CommunityState {
    mySnippets:CommunitySnippet[];
}

const defaultCommunityState: CommunityState = {
    mySnippets:[]
}

export const CommunityState = atom<CommunityState>({
    key:"communitiesState",
    default:defaultCommunityState
}) 