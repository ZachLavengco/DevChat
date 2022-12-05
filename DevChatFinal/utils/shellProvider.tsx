import React, { useCallback, useEffect } from "react";
import { History } from "../components/History";
import * as guest_commands from "./guest_commands";
import * as global_commands from "./global_commands";
import * as chat_commands from "./chat_commands";
import * as chatgroup_commands from "./chatgroup_commands";
import * as friend_commands from './friend_commands';
import User from "../interfaces/user";
import { auth } from "./firebase";

interface ShellContextType {
  history: History[];
  command: string;
  lastCommandIndex: number;
  user: User; // shell should keep track of the signed in user, otherwise "guest"
  directory: string;
  availableDirectories: any;
  commands: any;
  availableCommands: any;
  chatname: any;

  setUser: (username: string) => void;
  setHistory: (output: string) => void;
  setCommand: (command: string) => void;
  setLastCommandIndex: (index: number) => void;
  setDirectory: (directory: string) => void;
  setAvailableDirectories: (directories: any) => void;
  setCommands: (commands: any) => void;
  setAvailableCommands: (commands: any) => void;
  setChatname: (chatname: any) => void;
  execute: (command: string) => Promise<void>;
  clearHistory: () => void;
}

const ShellContext = React.createContext<ShellContextType>(null);

interface ShellProviderProps {
  children: React.ReactNode;
}

export const useShell = () => React.useContext(ShellContext);

export const ShellProvider: React.FC<ShellProviderProps> = ({ children }) => {
  const [init, setInit] = React.useState(true);
  const [user, _setUser] = React.useState<User>(null);
  const [history, _setHistory] = React.useState<History[]>([]);
  const [command, _setCommand] = React.useState<string>("");
  const [lastCommandIndex, _setLastCommandIndex] = React.useState<number>(0);
  const [directory, _setDirectory] = React.useState("~");
  const [availableDirectories, _setAvailableDirectories] = React.useState({});
  const [commands, _setCommands] = React.useState([]);
  const [availableCommands, _setAvailableCommands] = React.useState(guest_commands);
  const [chatname, _setChatname] = React.useState(null);
  

  useEffect(() => {
    setCommand("help");
  }, []);

  useEffect(() => {
    if (!init) {
      execute();
    }
  }, [command, init]);

  const setUser = (username: string) => {
    _setUser({ name: username });
  };

  const setHistory = (output: string) => {
    _setHistory([
      ...history,
      {
        id: history.length,
        date: new Date(),
        command: command.split(" ").slice(1).join(" "),
        output,
      },
    ]);
  };

  const setCommand = (command: string) => {
    _setCommand([Date.now(), command].join(" "));

    setInit(false);
  };

  const clearHistory = () => {
    _setHistory([]);
  };

  const setLastCommandIndex = (index: number) => {
    _setLastCommandIndex(index);
  };

  const setDirectory = (directory: string) => {
    _setDirectory(directory);
  };

  const setAvailableDirectories = (directories: string[]) => {
    _setAvailableDirectories(directories);
  };

  const setCommands = (commands: any) => {
    _setCommands(commands);
  };

  const setAvailableCommands = (availableCommands: any) => {
    _setAvailableCommands(availableCommands);
  };

  const setChatname = (chatname: string) => {
    _setChatname(chatname);
  }

  const execute = async () => {
    const [cmd, ...args] = command.split(" ").slice(1);

    // check if user is authenticated
    if (auth.currentUser != null) {
      switch (cmd) {
        /* ***** global commands ***** */
        case "clear":
          clearHistory();
          break;
        case "help":
          // let output = guest_commands['help'](args, commands);
          setHistory(guest_commands["help"](args,directory,commands));
          break;
        case "logout":
          setHistory(await global_commands["logout"]());
          break;
        case "ls":
          setHistory(await global_commands["ls"](directory));
          break;
        case "cd":
          let newDirectory = global_commands["cd"](
            args,
            directory,
            availableDirectories
          );
          if (newDirectory != null) {
            setDirectory(newDirectory);
          } else {
            setHistory("Invalid Directory.");
          }
          break;
        // end of global commands
        default:
          /* ***** directory level commands ***** */
          if (directory.startsWith("~/auth/chat")) {
            if (Object.keys(chatgroup_commands).indexOf(cmd) != -1) {
              try {
                const output = await (chatgroup_commands as any)[cmd](args);
                if (cmd == 'open'){
                  if (output != null) {
                    setChatname(output);
                  }
                  else {
                    setHistory(`Invalid chatname. Type 'ls' to view chats you are in.`)
                  }
                }
                else if (cmd == 'close'){
                  if (output != null) {
                    setChatname(null);
                  }
                  else {
                    setHistory(`Invalid syntax for ${cmd}. Type help for more info.`)
                  }
                }
                else {
                  setHistory(output);
                }
              } catch (error: any) {
                setHistory(error.message);
              }
            } 
            else if (Object.keys(chat_commands).indexOf(cmd) != -1) {
              try {
                const output = await (chat_commands as any)[cmd](args, chatname);
                setHistory(output);
              } catch (error: any) {
                setHistory(error.message);
              }
            }
            else {
              setHistory(
                `Command not found: ${cmd}. Try 'help' to see available commands.`
              );
            }

          }
          else if (directory.startsWith("~/auth/friends")) {
            if (Object.keys(friend_commands).indexOf(cmd) === -1) {
              setHistory(
                `Command not found: ${cmd}. Try 'help' to see available commands.`
              );
            } 
            else {
              try {
                const output = await (friend_commands as any)[cmd](args);
                setHistory(output);
              } catch (error: any) {
                setHistory(error.message);
              }
            }
          }
          else {
            setHistory( `Command not found: ${cmd}. Try 'help' to see available commands.`);
          }
          // end of directory level commands
      }
      // }
    } else {
      // directory is ~
      let output = "";
      switch (cmd) {
        case "clear":
          clearHistory();
          break;
        case "help":
          // let output = guest_commands['help'](args, commands);
          output = guest_commands["help"](args,directory,commands);
          setHistory(output);
          break;
        case "login":
          output = await (commands as any)[cmd]();
          setHistory(output);
          break;
        default:
          console.log(commands);
          setHistory("not available");
      }
    }
  };

  return (
    <ShellContext.Provider
      value={{
        user,
        history,
        command,
        directory,
        availableDirectories,
        commands,
        availableCommands,
        chatname,
        lastCommandIndex,
        setUser,
        setHistory,
        setCommand,
        setChatname,
        setLastCommandIndex,
        setCommands,
        setAvailableCommands,
        setAvailableDirectories,
        setDirectory,
        execute,
        clearHistory,
      }}
    >
      {children}
    </ShellContext.Provider>
  );
};
