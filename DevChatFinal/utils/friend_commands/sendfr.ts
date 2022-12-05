import {auth,db} from '../firebase'
import { doc, getDoc,setDoc,updateDoc,arrayUnion } from "firebase/firestore";


export async function sendfr(args: string[]){
    let friendEmail = args[0]
    if (friendEmail == auth.currentUser.email){
        return " seems like you don't have friends. Dont worry we can help! use the following id: donquixote3722@gmail.com thats your potential new friend :)"
    }
    const friendDocRef = await doc(db, "users", friendEmail);
    const docSnap = await getDoc(friendDocRef);

    if(docSnap.exists()){
        await updateDoc(friendDocRef, {
            pending_friend_requests: arrayUnion(auth.currentUser.email)
        });
        return " Request was successfully sent to your potential new friend!"

    }
    else{
        return " Please invite user to use our awesome application (user is not registered)"
    }

}