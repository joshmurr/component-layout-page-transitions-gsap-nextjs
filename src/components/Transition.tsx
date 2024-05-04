import { MorphItems, useTransitionState } from "@/context/TransitionContext";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Flip from "gsap/dist/Flip";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: none;
`;

gsap.registerPlugin(Flip);

const getPagePosition = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  };
};

export const Transition = ({ children }: any) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [exitChild, setExitChild] = useState(children);
  const [enterChild, setEnterChild] = useState(null);

  const counter = useRef(0);

  const { state, dispatch } = useTransitionState();
  const { contextSafe } = useGSAP();
  const morphClones = useRef<Map<string, any>>(new Map());

  const prepareElements = contextSafe(
    (fromItems: MorphItems, toItems: MorphItems) => {
      if (counter.current == 0) return;
      fromItems.forEach((morphEl, key) => {
        const clone = morphEl.cloneNode(true);
        const pagePosition = getPagePosition(morphEl);

        gsap.set(clone, {
          position: "absolute",
          margin: 0,
          autoAlpha: 1,
          ...pagePosition,
        });

        const targetEl = toItems.get(key);
        if (!targetEl) return;

        const stuff = {
          key,
          el: clone,
          target: targetEl,
          scale: true,
          pagePosition,
        };

        morphClones.current.set(key, stuff);

        if (overlayRef.current) {
          overlayRef.current.appendChild(clone);
        }
      });
    },
  );

  const animateElements = contextSafe((callback: () => void) => {
    let counter = 0;

    morphClones.current.forEach(({ el, target }) => {
      Flip.fit(el, target, {
        absolute: true,
        scale: true,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          callback();
          if (++counter === morphClones.current.size) {
            morphClones.current.clear();
            callback();
          }
        },
      });
    });
  });

  const animateOut = contextSafe(() => {
    const entry = state.componentStore.get(children.key);

    if (!entry) return;

    gsap
      .timeline()
      .to(entry.page, { autoAlpha: 1, duration: 1 })
      .then(() => {
        setExitChild(children);
        setEnterChild(null);
        if (overlayRef.current) {
          overlayRef.current.innerHTML = "";
        }
        dispatch({ type: "unmount", value: { key: exitChild.key } });
        counter.current = 0;
      });
  });

  const animate = contextSafe(() => {
    const exit = state.componentStore.get(exitChild.key);
    const entry = state.componentStore.get(children.key);

    if (!exit || !entry) return;

    gsap.set(entry.page, { autoAlpha: 0 });
    prepareElements(exit.morphItems, entry.morphItems);

    gsap
      .timeline()
      .to(exit.page, { autoAlpha: 0, duration: 2 })
      .then(() => {
        animateElements(animateOut);
      });

    counter.current++;
  });

  useEffect(() => {
    if (children.key === exitChild.key) return; /* nothing changed */
    setEnterChild(children);
    animate();
  }, [children, exitChild.key, animate]);

  return (
    <>
      <Overlay ref={overlayRef} />
      {enterChild}
      {exitChild}
    </>
  );
};

/* {cloneElement(displayComponent, pageProps)} */
