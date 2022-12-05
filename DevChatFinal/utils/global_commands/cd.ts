
// cd <subDirectory>

export function cd(args: string[], directory, availableDirectories) {
  if (args.length > 1) {
    return null;
  }
  // TO-DO
  // cd chat2
  // if ~/auth/chat then pull the group chats from db, check those chatnames
  // logic for checking the groupchats if the user is in the ~/auth/chat directory

  // ls
  /*
  prints the subdirectories
  ~/auth/chat
  chat1 chat2 chat3 ... (..)

  */

  /* cd
  ~/auth/chat 
  cd chat1
  ~/auth/chat/chat1
  */

  // openchat <chatname>
  

  const subDirectory = args[0];
  // ['chats', 'friends']
  // what will update available directories
  if (subDirectory == '..') {
    if (directory == "~/auth") return null;
    let prev = directory.split("/");
    prev.pop();
    let newDirectory = prev.join("/");
    console.log(newDirectory);
    return newDirectory;
  }

  if (directory in availableDirectories && availableDirectories[directory].includes(subDirectory)){
    const newDirectory = directory + "/" + subDirectory;

    return newDirectory;
  }

  return null;
}
