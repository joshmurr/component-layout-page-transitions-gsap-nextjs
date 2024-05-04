import { Transition } from "@/components/Transition";
import { TransitionProvider } from "@/context/TransitionContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import styled from "styled-components";

const Nav = styled.nav`
  display: flex;
  gap: 10px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
`;

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <TransitionProvider>
      <Nav>
        <Link href="/">Home</Link>
        <Link href="/apple">Apple</Link>
      </Nav>
      <Transition>
        <Component key={router.asPath} {...pageProps} />
      </Transition>
    </TransitionProvider>
  );
}
