import {
    MutableRefObject,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { config, useSpring } from "react-spring";

interface TargetProps {
    id: string;
    element: MutableRefObject<HTMLDivElement>;
}

interface Sections extends TargetProps {
    bounds: DOMRect;
}

const useScrollTo = (
    parent: MutableRefObject<HTMLDivElement>,
    targets: TargetProps[]
) => {
    if (targets.length === 0)
        throw new Error("ScrollTo Hook must have at least one target defined.");

    const [scrollPosition, setScrollPosition] = useState<number>(0);

    const sections = useMemo<Sections[]>(() => {
        return targets
            .filter((t) => t.element.current)
            .map(
                (t): Sections => ({
                    ...t,
                    bounds: t.element.current.getBoundingClientRect(),
                })
            );
    }, [targets]);

    const [, api] = useSpring(() => ({ y: 0 }));

    const scrollTo = useCallback(
        (id: string): void => {
            const target = sections.find((s) => s.id === id);
            if (!parent.current || !target) return;
            api.start({
                to: { y: target.bounds.top - 140 },
                reset: true,
                from: { y: parent.current.scrollTop },
                config: config.molasses,
                onChange: (_, ctrl) => {
                    parent.current.scrollTop = ctrl.get().y;
                },
            });
        },
        [parent, sections]
    );

    const currentSection = useMemo<string>(() => {
        if (sections.length === 0) return targets[0].id;
        else if (scrollPosition > sections[sections.length - 1].bounds.top)
            return sections[sections.length - 1].id;

        let s = sections.find(
            (s) =>
                s.bounds.top <= scrollPosition &&
                s.bounds.bottom >= scrollPosition
        );

        return s ? s.id : targets[0].id;
    }, [scrollPosition, sections]);

    //track current scroll position
    useEffect(() => {
        const listenerEvent = () => {
            setScrollPosition(parent.current.scrollTop);
        };
        parent.current &&
            parent.current.addEventListener("scroll", listenerEvent);
        return () => {
            parent.current &&
                parent.current.removeEventListener("scroll", listenerEvent);
        };
    }, [parent.current]);

    return [currentSection, scrollTo] as const;
};

export default useScrollTo;
