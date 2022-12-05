import { doc, setDoc, updateDoc, arrayUnion, arrayRemove, addDoc, collection, getCountFromServer} from "firebase/firestore"; 
import { getFirestore, getDoc } from "firebase/firestore";
import { stat } from "fs";
import {app, auth} from "../firebase"

export async function add (args: string[], incomingChat) {

    // ChatName will be provided by front-end. For now hardcoded to SauravChatRoom; // RESOLVED
    // Expected commandformat addUserToChat EMAILID

    if (incomingChat == null) {
        return "Open a chat first bro."
    }
    const chatName = incomingChat[0];
    const friendEmailID = args[0];

    const chatDocID = `${friendEmailID}_chats`;
    const documentID = `${auth.currentUser.email}_friends`;

    const db = getFirestore(app);
    const docRefForMe = await doc(db, "chats", `${auth.currentUser.email}:${chatName}`);
    let status = 0;
    try{
        const docRef = await doc(db, "user_friends", documentID);
        const docSnap = await getDoc(docRef);

        if(!docSnap.exists()){
            console.log("DOESNOT EXIST")            

        }else{
            // Handle some sort of Functionality Here to Notify the User that CreateChat failed
            // console.log("Cannot Add the message as already A Chat exists for Same Name");
            const friends = docSnap.data().friend_list;
            console.log(friends)
            for (let index = 0; index < friends.length; index++) {
                if (friends[index] == friendEmailID){
                    //This verifies that the User exists in the friend_list of me.
                    // Now adding the current user in the 
                    status = 1;
                    console.log("Found", friendEmailID)
                    await updateDoc(doc(db, "user_chats", chatDocID),{
                        chat_list: arrayUnion(docRefForMe)
                    })
                }
            }
            if(status == 0){
                return ("Cannot add User to chat as the user is not a friend!");
            }
        }
    }catch(error){
        console.log(error)
    }
}
