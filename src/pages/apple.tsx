import { Page } from "@/components/Page";
import { Thing } from "@/components/Thing";
import { useTransitionState } from "@/context/TransitionContext";
import { useLayoutEffect, useRef } from "react";

export default function Apple() {
  const pageRef = useRef(null);
  const morphRefs = useRef<Map<string, any>>(new Map());

  const { dispatch } = useTransitionState();

  useLayoutEffect(() => {
    if (!pageRef.current || !morphRefs.current) return;
    dispatch({
      type: "mount",
      value: {
        key: "/apple",
        page: pageRef.current,
        morphItems: morphRefs.current,
      },
    });
  }, [dispatch]);

  return (
    <Page ref={pageRef}>
      <Thing
        ref={(ref) => morphRefs.current.set("morph-blue", ref)}
        color="blue"
      >
        Applppleles
      </Thing>
      <Thing color="yellow">Something</Thing>
      <Thing color="red" ref={(ref) => morphRefs.current.set("morph-red", ref)}>
        Something
      </Thing>
    </Page>
  );
}
