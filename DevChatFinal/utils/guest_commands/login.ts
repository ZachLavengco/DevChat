import {auth,db} from '../firebase'
import {signInWithPopup,GoogleAuthProvider} from 'firebase/auth'
import { doc, getDoc,setDoc } from "firebase/firestore";

const googleAuth = new GoogleAuthProvider();

export async function login () {
    console.log('logging in yp',auth)
    if (auth.currentUser==null){
        try{
            const result = await signInWithPopup(auth,googleAuth);
        }
        catch (err)
        {
            console.log(err);
        }

        if (auth.currentUser==null){
            return 'login failed';
        }
        else{
            console.log("auth : ",auth.currentUser.email)
            
            try {
                const docRef = await doc(db, "users", auth.currentUser.email);
                const docSnap = await getDoc(docRef);

                if(!docSnap.exists()){
                    console.log("createing db entry since logiing first time")
                    
                    //get NULL document reference to chats and user
                    const nullChatsRef = await doc(db,"chats","NULL")
                    const nullFriendsRef = await doc(db,"users","NULL")
                    
                    //create user_chats
                    await setDoc(doc(db, "user_chats", auth.currentUser.email+'_chats'), {
                        chat_list: [nullFriendsRef]
                    })

                    //create user_friends
                    await setDoc(doc(db, "user_friends", auth.currentUser.email+'_friends'), {
                        friend_list: [""] 
                    })

                    //create users
                    const refFriendList = await doc(db,"user_friends",auth.currentUser.email+'_friends')
                    const refChatList = await doc(db,"user_chats",auth.currentUser.email+'_chats')
                    const res = await setDoc(doc(db, "users", auth.currentUser.email),{
                        userid:auth.currentUser.email,
                        chats:refChatList,
                        friends:refFriendList,
                        pending_friend_requests: [""]
                    } )


                }
                return 'logged in successfully as '+auth.currentUser.displayName;
            }
            catch(error){
                console.log(error)
                return 'An unexpected error occoured we are working on it!'
            }

            
            
        }
    }
    else{
        return 'already logged in as '+auth.currentUser.displayName;
    }
    
} ;
