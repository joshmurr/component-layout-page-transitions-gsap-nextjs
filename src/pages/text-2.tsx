import { Page } from "@/components/Page";
import { Paragraph } from "@/components/Paragraph";
import { Word } from "@/components/Word";
import {
  useComponentStore,
  registerMorphItem,
} from "@/context/TransitionContext";
import { shuffled } from "@/data/text";

export default function Text_2() {
  const [pageRef, morphRefs] = useComponentStore("/text-2", {
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
      <Paragraph>
        {shuffled.map(({ word, hash }) => {
          const key = `morph-${hash}`;
          return (
            <Word
              key={key}
              ref={registerMorphItem(key, morphRefs)}
              dangerouslySetInnerHTML={{ __html: word }}
            />
          );
        })}
      </Paragraph>
    </Page>
  );
}
