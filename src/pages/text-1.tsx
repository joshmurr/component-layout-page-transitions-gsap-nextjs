import { Page } from "@/components/Page";
import { Word } from "@/components/Word";
import {
  useComponentStore,
  registerMorphItem,
} from "@/context/TransitionContext";
import { words } from "@/data/text";

export default function Text_1() {
  const [pageRef, morphRefs] = useComponentStore("/text-1", {
    animations: {
      enter: {
        autoAlpha: 1,
        duration: 0,
      },
      exit: {
        autoAlpha: 0,
        duration: 0,
      },
    },
  });

  return (
    <Page ref={pageRef}>
      <p>
        {words.map(({ word, hash }) => {
          const key = `morph-${hash}`;
          return (
            <Word
              key={key}
              ref={registerMorphItem(key, morphRefs)}
              dangerouslySetInnerHTML={{ __html: word }}
            />
          );
        })}
      </p>
    </Page>
  );
}
