import { doc, getDoc, collection, addDoc } from "firebase/firestore"; 
import { getFirestore } from "firebase/firestore";
import {app, auth} from "./firebase"

export async function getChats () {
    let entity = auth.currentUser.email;

    // Adding document below
    const db = getFirestore(app)

    try{

        const userInfo = await getDoc(doc(db, "users", entity))

        const user_chatsName = userInfo.data().chats.id
        const chatInfo = await getDoc(doc(db, "user_chats", user_chatsName))
        const chatList = chatInfo.data().chat_list
        
        let chats = [];
        for (const c of chatList) {
            console.log(c,'test')
            if (c.id == "NULL") {
                continue
            }
            const chat_uuid = c.id
            const chatInfo = await getDoc(doc(db, "chats", chat_uuid))
            const chatName = chatInfo.data().chat_name
            chats.push({"chatName" :chatName, "uuid" : chat_uuid});
        }
        return chats

    }catch(error){
        console.log(error)
    }
}
