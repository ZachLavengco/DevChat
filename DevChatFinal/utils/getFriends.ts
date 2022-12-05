import { Console } from "console";
import { doc, setDoc, updateDoc, getDoc, arrayUnion, arrayRemove, addDoc, collection, getCountFromServer} from "firebase/firestore"; 
import { getFirestore } from "firebase/firestore";
import {app, auth,db} from "./firebase"
import {opformat} from './utilities'

export async function getFriends() {
    let entity = auth.currentUser.email;


    try{

        const userInfo = await getDoc(doc(db, "users", entity))
        const user_friendsName = userInfo.data().friends.id
        const friendInfo = await getDoc(doc(db, "user_friends", user_friendsName))
        const friendList = friendInfo.data().friend_list
        console.log(friendList)

        let friends = []

        if (friendList != null){
            for (const f of friendList) {
                if (f == "") {
                    continue
                }
                const friendName = f
                friends.push(friendName);
            }
        }
        
        if (friends.length == 0) {
            return "You have no friends!"
        }

        return opformat(friends)

    }catch(error){
        console.log(error)
    }
}

