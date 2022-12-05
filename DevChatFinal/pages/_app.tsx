import "../styles/globals.css";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import type { AppProps } from "next/app";
import { ShellProvider } from "../utils/shellProvider";
import React from "react";

export default function App({ Component, pageProps }: AppProps) {
  console.log(pageProps);
  console.log(Component);
  return (
    <>
      <ShellProvider>
          <Component {...pageProps}/>
      </ShellProvider>
    </>
  );
}
