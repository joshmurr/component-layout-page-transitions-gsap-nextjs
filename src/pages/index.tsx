import { Page } from "@/components/Page";
import { Thing } from "@/components/Thing";
import {
  useComponentStore,
  registerMorphItem,
} from "@/context/TransitionContext";
import styled from "styled-components";

const BiggerThing = styled(Thing)`
  width: 600px;
  height: 500px;
`;

export default function Home() {
  const [pageRef, morphRefs] = useComponentStore("/");

  return (
    <Page ref={pageRef}>
      <BiggerThing color="red" ref={registerMorphItem("morph-red", morphRefs)}>
        Something
      </BiggerThing>
      <Thing color="green">Something</Thing>
      <Thing color="blue" ref={registerMorphItem("morph-blue", morphRefs)}>
        Something
      </Thing>
    </Page>
  );
}
