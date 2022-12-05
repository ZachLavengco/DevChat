import {auth,db} from '../firebase'
import { doc, getDoc,setDoc,updateDoc,arrayUnion ,arrayRemove} from "firebase/firestore";
import { updateCurrentUser } from 'firebase/auth';


export async function acceptfr(args: string[]){

    const requestId = args[0]

    const myDocRef = await doc(db, "users", auth.currentUser.email);
    const myDocSnap = await getDoc(myDocRef);

    if(myDocSnap.exists()){
        let flist = myDocSnap.data().pending_friend_requests||[]
        if(flist.length == 0){
            return "No pending friend requests to accept"
        }
        let i =0,flag=0
        for (i=0;i<flist.length;i++){
            if (flist[i]==requestId)
            {
                flag = 1
                break 
            } 
        }

        if (flag==0)
        {
            return "pending request not found"
        }

        if (flag==1)
        {
            
            
            //add to other users friends
            const otherFriendsRef =  await doc(db, "user_friends", requestId+"_friends");
            await updateDoc(otherFriendsRef,{
                friend_list:arrayUnion(auth.currentUser.email)
            })


            //add to my user_firends
            const myFriendsRef = await doc(db, "user_friends", auth.currentUser.email+"_friends");
            await updateDoc(myFriendsRef,{
                friend_list:arrayUnion(requestId)
            })

            //delete

            await updateDoc(myDocRef, {
                pending_friend_requests: arrayRemove(requestId)
            });

            return 'you are now friends with '+requestId
        }
        
    }
    else{
        return " unexpected error occoured we are working on getting it fixed!  "
    }
    
}