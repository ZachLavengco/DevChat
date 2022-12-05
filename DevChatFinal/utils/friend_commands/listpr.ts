import {auth,db} from '../firebase'
import { doc, getDoc,setDoc,updateDoc,arrayUnion } from "firebase/firestore";
import { updateCurrentUser } from 'firebase/auth';
import { opformat } from '../utilities';


export async function listpr(){
    
    const myDocRef = await doc(db, "users", auth.currentUser.email);
    const docSnap = await getDoc(myDocRef);

    if(docSnap.exists()){
        console.log(' list ',docSnap.data().pending_friend_request)
        let flist = docSnap.data().pending_friend_requests||[]
        console.log('flist ',flist,typeof(flist))
        if(flist.length == 0){
            return "No pending friend requests"
        } 
        return 'Pending Friend Request : \n ' + opformat(flist)
    }
    else{
        return " unexpected error occoured we are working on getting it fixed!  "
    }

}