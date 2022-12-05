import Head from "next/head";
import Input from "../components/Input";
import { useShell } from "../utils/shellProvider";
import { History } from "../components/History";
import React from "react";
import MessageWindow from "../components/MessageWindow";
import { auth } from "../utils/firebase";

import { app } from "../utils/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, getFirestore, collection, query, getDoc, orderBy } from "firebase/firestore";
import * as guest_commands from "../utils/guest_commands";
import * as global_commands from "../utils/global_commands";
import * as chat_commands from "../utils/chat_commands";
import * as friend_commands from "../utils/friend_commands";

const Chat =  (props) => {
  const {
    history,
    chatname,
    directory,
    setAvailableDirectories,
    setAvailableCommands,
    setDirectory,
    setCommands,
    commands,
  } = useShell();
  const [messages, setMessages] = React.useState([]);
  const containerRef = React.useRef(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [unsubscriber, setUnsubscriber] = React.useState(null);

  React.useEffect(() => {
    // add code here to intialize messages state from db only if the user is authenticated
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // initialize directory, availableDirectories, availableCommands for an authenticated user
        setDirectory("~/auth");
        console.log(guest_commands);
        const commandMapping = {
          "~": guest_commands, // {}
          "~/auth": { ...guest_commands, ...global_commands },
          "~/auth/chat": { ...guest_commands, ...global_commands },
          "~/auth/chat/": {
            ...guest_commands,
            ...global_commands,
            ...chat_commands,
          },
          "~/auth/friends": {
            ...guest_commands,
            ...global_commands,
            ...friend_commands,
          },
        };
        setAvailableCommands(commandMapping);
        setCommands(commandMapping["~/auth"]);

        const directoryMapping = {
          "~/auth": ["friends", "chats"],
          "~/auth/chat": [".."],
          "~/auth/friends": [".."],
        };

        setAvailableDirectories(directoryMapping);
      } else {
        setDirectory("~");
        setCommands(guest_commands);
        setAvailableCommands({ "~": guest_commands });
        setAvailableDirectories({});
        setMessages([]);
        console.log("Not logged In");
      }
      //console.log(commands);
    });
  }, []);

  React.useEffect( () => {
    setMessages([]);
    if (unsubscriber != null) {
      console.log("CALLING UNSUB")
      unsubscriber(); // unsub prev; 
      setUnsubscriber(null);
    }
    if (chatname) {
      const db = getFirestore(app);
      const q = query(collection(db,"chats", chatname[1], "messages"), orderBy("timestamp", 'asc'));
      const unsub = onSnapshot(q, async (querySnapshot) => {
        console.log(querySnapshot);
        const docs = querySnapshot.docs;
        let messageData = [];
        for (let i = 0 ; i < docs.length; i++) {
          console.log(await docs[i].data());
          let d = await docs[i].data();
          messageData.push({
            id: i,
            user: d.sender,
            message: d.message,
          })
          console.log(messageData);
        }
        setMessages(messageData);
        // if (doc.data()) {
        //   const dataSnap = doc.data()["messages"];
        //   // let lastDataSizeIndex = ;
        //   console.log(dataSnap);

        //   let messageData = [...messages];

        //   // Can be improved. Did lazy loading, will setMessage for all the incoming updates
        //   for (let index = 0; index < dataSnap.length; index++) {
        //     // Uncomment the line as per your requirement once rendering logic is handled!
        //     messageData.push({
        //       id: index,
        //       user: dataSnap[index].sender,
        //       message: dataSnap[index].message,
        //     });
        //   }
        //   console.log(messageData);
        //   //console.log(messageData);
        //   setMessages(messageData);
        // }
      });
      // console.log(unsub);
       setUnsubscriber(() => unsub);
    }
  }, [chatname]);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [history]);

  return (
    <>
      <Head>
        <title>DevChat</title>
      </Head>
      <div className="static flex">
        <div
          ref={containerRef}
          className="w-full my-auto absolute inset-y-0 left-0 overflow-auto bg-black"
        >
          <History history={history} />
          <Input inputRef={inputRef} containerRef={containerRef} />
        </div>
        {auth.currentUser != null &&
        chatname != null &&
        directory == "~/auth/chats" ? (
          <div className="my-auto absolute inset-y-0 right-0 w-1/3">
            <MessageWindow messages={messages} chatname={chatname} />
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Chat;
