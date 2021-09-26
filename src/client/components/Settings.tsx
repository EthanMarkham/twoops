import React, { useMemo, useState, useEffect } from "react";
import {
    TransitionFn,
    animated,
    TransitionRenderFn,
    SpringValue,
} from "react-spring";
import useStore from "../store";
import { CancelButton, Container, NavBar } from "../styles/settings";
const AnimatedContainer = animated(Container);
interface SettingsProps {
    style: {
        opacity: SpringValue<number>;
        transform: SpringValue<string>;
    };
}
const SettingsPanel = ({ style }: SettingsProps) => {
    const user = useStore((state) => state.roundInfo.shot.user);
    const togglePanel = useStore((state) => state.toggleSettings);
    return (
        <AnimatedContainer style={style}>
            <NavBar>
                <CancelButton
                    onClick={() => {
                        togglePanel();
                    }}
                />
            </NavBar>
        </AnimatedContainer>
    );
};

export default SettingsPanel;
