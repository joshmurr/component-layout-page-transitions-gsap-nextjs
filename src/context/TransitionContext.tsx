import React, {
  RefObject,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import gsap from "gsap";

type Path = `/${string}`;
export type MorphItems = Map<string, HTMLElement>;
type ComponentStore = Map<Path, { page: HTMLElement; morphItems: MorphItems }>;

type TransitionContextState = {
  componentStore: ComponentStore;
  timeline: gsap.core.Timeline;
};

type TransitionContextAction =
  | {
      type: "mount";
      value: {
        key: Path;
        page: HTMLElement;
        morphItems: MorphItems;
      };
    }
  | {
      type: "unmount";
      value: { key: Path };
    };

const initialState: TransitionContextState = {
  componentStore: new Map(),
  timeline: gsap.timeline({ paused: true }),
};

type TransitionContextValue = {
  state: TransitionContextState;
  dispatch: React.Dispatch<TransitionContextAction>;
};

const TransitionContext = createContext<TransitionContextValue>({
  state: initialState,
  dispatch: () => {},
});

const handleMount = (
  componentStore: ComponentStore,
  value: { key: Path; page: HTMLElement; morphItems: MorphItems },
) => {
  componentStore.set(value.key, value);

  return componentStore;
};

const handleUnmount = (
  componentStore: ComponentStore,
  value: { key: Path },
) => {
  componentStore.delete(value.key);
  return componentStore;
};

const reducer = (
  prevState: TransitionContextState,
  action: TransitionContextAction,
) => {
  switch (action.type) {
    case "mount":
      return {
        ...prevState,
        componentStore: handleMount(prevState.componentStore, action.value),
      };

    case "unmount":
      return {
        ...prevState,
        componentStore: handleUnmount(prevState.componentStore, action.value),
      };
    default:
      throw new Error();
  }
};

interface Props {
  children: React.ReactNode;
}

const TransitionProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <TransitionContext.Provider value={{ state, dispatch }}>
      {children}
    </TransitionContext.Provider>
  );
};

const useTransitionState = () => {
  return useContext(TransitionContext);
};

const useComponentStore = (pageKey: Path) => {
  const pageRef = useRef(null);
  const morphRefs = useRef<MorphItems>(new Map());

  const { dispatch } = useTransitionState();

  useEffect(() => {
    if (!pageRef.current || !morphRefs.current) return;
    dispatch({
      type: "mount",
      value: {
        key: pageKey,
        page: pageRef.current,
        morphItems: morphRefs.current,
      },
    });
  }, [dispatch, pageKey]);

  return [pageRef, morphRefs] as const;
};

const registerMorphItem = (key: string, morphRefs: RefObject<MorphItems>) => {
  return (node: HTMLElement | null) => {
    if (node && morphRefs && morphRefs.current) {
      morphRefs.current.set(key, node);
    }
  };
};

export {
  TransitionContext,
  TransitionProvider,
  useTransitionState,
  useComponentStore,
  registerMorphItem,
};
