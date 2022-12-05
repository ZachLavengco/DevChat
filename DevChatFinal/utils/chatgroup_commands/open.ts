import { getChats } from "../getChats";

export async function open(args: string[]) {
    // get all current chats
    if (args.length > 1) {
        return null;
    } 

    const chatname = args[0];
    //get all current chats, check if valid, return chatname if valid
    const chatnames = await getChats();
    console.log(chatnames);
    let names = []

    for (const c of chatnames) {
        names.push(c.chatName)
    }
    let index = names.indexOf(chatname)
    if (index != -1) {
        console.log(chatnames[index].uuid);
        return [chatname, chatnames[index].uuid]
    }
    return null;
}