import React, { useMemo } from "react";
import { ToggleHolder, ToggleBackground, ToggleSlider } from "../styles/toggle";

interface ToggleInputProps {
    toggle: boolean;
    gridPos?: [number | string, number | string];
    onClick(): void;
}
const Toggle = ({ toggle, gridPos, onClick }: ToggleInputProps) => {
    const backgroundRef =
        React.useRef() as React.MutableRefObject<HTMLSpanElement>;

    const sliderRef = React.useRef() as React.MutableRefObject<HTMLDivElement>;

    const slideAmount = useMemo(
        () =>
            backgroundRef.current && sliderRef.current
                ? backgroundRef.current.offsetWidth -
                  sliderRef.current.offsetWidth
                : 0,
        [sliderRef.current, backgroundRef.current]
    );

    return (
        <ToggleHolder toggle={toggle} gridPos={gridPos}>
            <ToggleSlider
                slideAmount={slideAmount}
                toggle={toggle}
                onClick={onClick}
                ref={sliderRef}
            >
                {toggle ? "ON" : "OFF"}
            </ToggleSlider>
            <ToggleBackground ref={backgroundRef} toggle={toggle} />
        </ToggleHolder>
    );
};

export default Toggle;
