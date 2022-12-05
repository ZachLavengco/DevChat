import { listChats } from "../listChats"
import { getFriends } from "../getFriends"

export async function ls(directoryMapping) {
    

    if (directoryMapping=='~/auth')
        return "chats friends"
    else if (directoryMapping=='~/auth/friends')
    {
        return await getFriends()
    }
    else if (directoryMapping=='~/auth/chats')
    {
        return await listChats()
    }

    // ~/auth/friends
    /*
    1) fetch the friends 
    2) update the mapping
    3) list out the friends
    */
    // ~/auth/chat
    /*
    1) fetch the chats 
    2) update the mapping
    3) list out the chats
    */
    //if directoryMapping == ''

}