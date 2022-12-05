import { MessageList, Message } from "@chatscope/chat-ui-kit-react";
import { auth } from "../utils/firebase";
// container for all messages
export const MessageWindow = (props) => {
  const { messages, chatname } = props;
  return (
    <>
      <div className="flex justify-center  text-black bg-white divide-y-2">
        <h1>{chatname[0]}</h1>
      </div>
        <hr className="bg-gray-200 w-max"/>
      <MessageList>
          {messages.map((m, i) => {
            return (
              <Message
              key={i}
              model={{
                position: "single",
                direction: (auth.currentUser!=null && m.user == auth.currentUser.displayName) ? "outgoing" : "incoming",
                type: "text"
              }}
              >
                <Message.TextContent text={m.message} className="font-modeseven text-black"/>
                <Message.Header sender={m.user} className="font-modeseven text-grey"/>
              </Message>
            );
          })}
      </MessageList>
    </>
  );
};

export default MessageWindow;
