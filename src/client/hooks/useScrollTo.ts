import React, { MutableRefObject, useEffect, useMemo, useState } from "react";

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

    const currentSectionIndex = useMemo<number>(() => {
        if (sections.length <= 1) return 0;
        else if (scrollPosition < sections[0].bounds.top) return 0;
        else if (scrollPosition > sections[sections.length - 1].bounds.top)
            return sections.length - 1;
        else
            return sections.findIndex(
                (s) =>
                    s.bounds.top <= scrollPosition &&
                    s.bounds.bottom >= scrollPosition
            );
    }, [scrollPosition, sections]);

    const currentSection = useMemo<string>(() => {
        if (sections.length === 0) return targets[0].id;
        if (!sections[currentSectionIndex])
            throw new Error("Target scroller index is out of bounds.");

        return sections[currentSectionIndex].id;
    }, [sections, currentSectionIndex]);

    //track current scroll position
    useEffect(() => {
        if (parent.current) {
            parent.current.addEventListener("scroll", (_) => {
                setScrollPosition(parent.current.scrollTop);
            });

            return () => {
                parent.current.removeEventListener("scroll", (_) => {
                    setScrollPosition(parent.current.scrollTop);
                });
            };
        }
    }, [parent.current]);

    return [currentSection] as const;
};

export default useScrollTo;
