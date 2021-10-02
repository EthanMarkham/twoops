import { MutableRefObject, useEffect, useState } from "react";

const useMouseEntered = (body: MutableRefObject<HTMLElement>): boolean => {
    //track mouse enter
    const [mouseEntered, setMouseEntered] = useState<boolean>(false);

    useEffect(() => {
        if (body.current) {
            body.current.addEventListener("mouseenter", (_) => {
                setMouseEntered(true);
            });
            body.current.addEventListener("mouseleave", (_) => {
                setMouseEntered(false);
            });

            return () => {
                body.current.removeEventListener("mouseenter", (_) => {
                    setMouseEntered(true);
                });
                body.current.removeEventListener("mouseleave", (_) => {
                    setMouseEntered(false);
                });
            };
        }
    });

    return mouseEntered;
};

export default useMouseEntered;
