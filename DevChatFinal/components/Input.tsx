import { useEffect, useState } from "react";
import { useShell } from "../utils/shellProvider";
import ShellPrompt from "./ShellPrompt";

// component will take in all user input, process commands,
export const Input = ({
  inputRef,
  containerRef,
}: {
  inputRef: any;
  containerRef: any;
}) => {
  const [value, setValue] = useState(""); // the value of the input at the time of a keyboard event

  const {
    setCommand,
    history,
    lastCommandIndex,
    setHistory,
    setLastCommandIndex,
    clearHistory,
  } = useShell();

  useEffect(() => {
    containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
  }, [history]);

  const onSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    const commands: string[] = history
      .map(({ command }) => command)
      .filter((value: string) => value);

    if (event.key === "Enter" || event.code === "13") {
      setCommand(value);
      setLastCommandIndex(0);
      setValue("");
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-row space-x-2 bg-black">
      <label htmlFor="prompt" className="flex-shrink">
        <ShellPrompt />
      </label>
      <input
        style={{"display": "inline-block"}}
        ref={inputRef}
        type="text"
        id="prompt"
        className="focus:outline-none flex-grow bg-black"
        aria-label="prompt"
        onChange={(event) => {
          setValue(event.target.value);
        }}
        onKeyDown={onSubmit}
      />
    </div>
  );
};

export default Input;
