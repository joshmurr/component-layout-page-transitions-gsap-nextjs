import { Page } from "@/components/Page";
import { Thing } from "@/components/Thing";
import {
  useComponentStore,
  registerMorphItem,
} from "@/context/TransitionContext";

export default function Apple() {
  const [pageRef, morphRefs] = useComponentStore("/apple");

  return (
    <Page ref={pageRef}>
      <Thing color="blue" ref={registerMorphItem("morph-blue", morphRefs)}>
        Applppleles
      </Thing>
      <Thing color="yellow">Something</Thing>
      <Thing color="red" ref={registerMorphItem("morph-red", morphRefs)}>
        Something
      </Thing>
    </Page>
  );
}
