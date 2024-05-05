import { Page } from "@/components/Page";
import { Thing } from "@/components/Thing";
import {
  type MorphItems,
  useTransitionState,
} from "@/context/TransitionContext";
import { useEffect, useRef } from "react";

export default function Orange() {
  const pageRef = useRef(null);
  const morphRefs = useRef<MorphItems>(new Map());

  const { dispatch } = useTransitionState();

  useEffect(() => {
    if (!pageRef.current || !morphRefs.current) return;
    dispatch({
      type: "mount",
      value: {
        key: "/orange",
        page: pageRef.current,
        morphItems: morphRefs.current,
      },
    });
  }, [dispatch]);

  return (
    <Page ref={pageRef}>
      <Thing color="orange">Something</Thing>
      <Thing
        ref={(ref) => {
          morphRefs.current.set("morph-blue", ref!);
        }}
        color="blue"
      >
        Applppleles
      </Thing>
      <Thing color="purple">Something</Thing>
    </Page>
  );
}
