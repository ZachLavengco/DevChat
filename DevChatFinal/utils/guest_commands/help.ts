
export function help(args, directoryMapping, commands) {
   if (args.length!=0){
      let command = args[0]
      switch (command) {
         case "sendfr":
            return "\n send a friend request \n usage : sendfr xyz@abc.com \n only accessible in friends dir"
            break;
         case "listpr":
            return "\n shows list of pending friend requests \n usage : listpr \n only accessible in friends dir"
            break;
         case "acceptfr":
            return "\n accept a friend request from pending friend request list \n usage : acceptfr xyz@abc.com \n only accessible in friends dir"
           break;
         case "open":
            return "\n opens a chat \n usage : open chatname \n only accessible in chat dir"
           break;
         case "create":
            return "\n creates a new chat \n usage : chat chatname \n only accessible in chat dir"
           break;
         case "close":
            return "\n closes an open chat \n usage : close \n only accessed once chat is open"
           break;
         case "add":
            return "\n adds new friend to chat \n usage : add friendId \n only accessed once chat is open"
           break;
         case "send":
            return "\n sends a message in open chat \n usage : send message \n also try send pokemon pokemon_name , send weather location , send brewery brewery_name  \n only accessible in chat dir"
           break;
         default:
           return "\n No information found for "+command
       }
      
   }

   if (directoryMapping=='~/auth')
      return "\n use ls and cd commands to navigate to auth/friends or auth/chats directory and cd .. to go one level back \n To get more information type help command_name \n eg: help sendfr"
   else if (directoryMapping=='~/auth/friends')
   {
      return "\n list of available commands: sendfr, listpr, acceptfr, ls, cd \n To get more information type help command_name \n eg: help sendfr"
   }
   else if (directoryMapping=='~/auth/chats')
   {
      return "\n list of available commands: create, open, close. \n Once a chat is opened user may use add and send commands \n To get more information type help command_name \n eg: help sendfr"
   }
   else{
      return "\n Welcome to DevChat \n Try using the login command if you are not authorized yet \n You can access the help command for additional guidance once logged in"
   }

   return 'help meeeee';
}