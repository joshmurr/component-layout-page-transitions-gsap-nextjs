import { Page } from "@/components/Page";
import { Thing } from "@/components/Thing";
import {
  type MorphItems,
  useTransitionState,
} from "@/context/TransitionContext";
import { useEffect, useRef } from "react";
import styled from "styled-components";

const BiggerThing = styled(Thing)`
  width: 600px;
  height: 500px;
`;

export default function Home() {
  const pageRef = useRef(null);
  const morphRefs = useRef<MorphItems>(new Map());

  const { dispatch } = useTransitionState();

  useEffect(() => {
    if (!pageRef.current || !morphRefs.current) return;
    dispatch({
      type: "mount",
      value: {
        key: "/",
        page: pageRef.current,
        morphItems: morphRefs.current,
      },
    });
  }, [dispatch]);

  return (
    <Page ref={pageRef}>
      <BiggerThing
        color="red"
        ref={(ref) => {
          morphRefs.current.set("morph-red", ref!);
        }}
      >
        Something
      </BiggerThing>
      <Thing color="green">Something</Thing>
      <Thing
        ref={(ref) => {
          morphRefs.current.set("morph-blue", ref!);
        }}
        color="blue"
      >
        Something
      </Thing>
    </Page>
  );
}
