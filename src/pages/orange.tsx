import { Page } from "@/components/Page";
import { Thing } from "@/components/Thing";
import {
  useComponentStore,
  registerMorphItem,
} from "@/context/TransitionContext";

export default function Orange() {
  const [pageRef, morphRefs] = useComponentStore("/orange");

  return (
    <Page ref={pageRef}>
      <Thing color="orange">Something</Thing>
      <Thing color="blue" ref={registerMorphItem("morph-blue", morphRefs)}>
        Applppleles
      </Thing>
      <Thing color="purple">Something</Thing>
    </Page>
  );
}
