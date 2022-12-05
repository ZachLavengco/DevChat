import { doc, setDoc, updateDoc, arrayUnion, arrayRemove, addDoc, collection, getCountFromServer, collectionGroup} from "firebase/firestore"; 
import { getFirestore, getDoc } from "firebase/firestore";
import {app, auth} from "../firebase"

export async function create (args: string[]) {

    // Expected commandformat createChat CHATNAME
    const chatName = args[0];
    if(chatName == null){
        return "Please provide a ChatName!"
    }
    const emailID = auth.currentUser.email;
    const chatID = emailID+":"+chatName;

    let chatData = {"chat_name": chatName} ;
    const db = getFirestore(app);
    try{
        const docRef = await doc(db, "chats", chatID);
        const docSnap = await getDoc(docRef);

        if(!docSnap.exists()){
            await setDoc(doc(db, "chats", chatID), chatData);
            //Trying to insert a backlink in the user_chats
            try{
                const docRefOuter = docRef;
                const docRefInnerNesting = await doc(db, "user_chats", `${emailID}_chats`);
                const docSnapInnerNesting = await getDoc(docRefInnerNesting);
                if(!docSnapInnerNesting.exists()){
                    const docRef = await setDoc(doc(db, "user_chats", `${emailID}_chats`), {
                        chat_list: [docRefOuter]
                    })
        
                }else{
                    await updateDoc(doc(db, "user_chats", `${emailID}_chats`), {
                        chat_list: arrayUnion(docRefOuter)
                    })
                }
            }catch(error){
                console.log(error)
            }
            

        }else{
            // Handle some sort of Functionality Here to Notify the User that CreateChat failed
            return ("A chat exists with the same name!");
        }
    }catch(error){
        console.log(error)
    }
}
