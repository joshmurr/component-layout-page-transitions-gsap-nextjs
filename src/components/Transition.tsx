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

  /* I don't link counting renders but this component needs to
   * render twice for this to work. */
  const renderCounter = useRef(0);

  const { state, dispatch } = useTransitionState();
  const { contextSafe } = useGSAP();
  const morphClones = useRef<Map<string, any>>(new Map());

  const prepareElements = contextSafe(
    (fromItems: MorphItems, toItems: MorphItems) => {
      if (renderCounter.current == 0) return;
      fromItems.forEach((morphEl, key) => {
        const targetEl = toItems.get(key);
        /* No matching morphEl so ignore */
        if (!targetEl) return;

        const clone = morphEl.cloneNode(true);
        const pagePosition = getPagePosition(morphEl);

        gsap.set(clone, {
          position: "absolute",
          margin: 0,
          autoAlpha: 1,
          ...pagePosition,
        });

        const toMorph = {
          key,
          el: clone,
          target: targetEl,
          scale: clone.nodeName === "DIV",
          pagePosition,
        };

        morphClones.current.set(key, toMorph);

        if (overlayRef.current) {
          overlayRef.current.appendChild(clone);
        }
      });
    },
  );

  const animateElements = contextSafe((callback: () => void) => {
    /* You can't sequence or time Flip animations so you need to
     * count them to get a total onComplete callback. */
    let counter = 0;

    if (!morphClones.current.size) {
      callback();
      return;
    }

    morphClones.current.forEach(({ el, target, scale }) => {
      Flip.fit(el, target, {
        absolute: true,
        scale,
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
      .to(entry.page, entry.animations.enter)
      .then(() => {
        setExitChild(children);
        setEnterChild(null);
        if (overlayRef.current) {
          overlayRef.current.innerHTML = "";
        }
        dispatch({ type: "unmount", value: { key: exitChild.key } });
        renderCounter.current = 0;
      });
  });

  const animate = contextSafe(() => {
    /* Grab the refs from the store */
    const exit = state.componentStore.get(exitChild.key);
    const entry = state.componentStore.get(children.key);

    if (!exit || !entry) {
      renderCounter.current++;
      return;
    }

    /* Page setup:
     * - Hide the incoming entry page.
     * - Clone all the relevant layout (morph) items. */

    gsap.set(entry.page, { autoAlpha: 0 });
    prepareElements(exit.morphItems, entry.morphItems);

    /* Exit animations for whole exit page */
    gsap
      .timeline()
      .to(exit.page, exit.animations.exit)
      .then(() => {
        /* Do the morphing with a callback */
        animateElements(animateOut);
      });
    renderCounter.current++;
  });

  useEffect(() => {
    if (children.key === exitChild.key) return; /* nothing changed */
    /* Mount new child. It it initially hidden by the current exit child
     * providing a background color is set. */
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
