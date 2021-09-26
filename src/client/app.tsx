import React, { Suspense, useEffect, useState } from "react";
import useStore, { Page } from "./store";
import { PageHolder } from "./styles";
import GlobalFonts from "./styles/fonts";
import {
    useSpring,
    useTransition,
    animated as a,
    config as springConfig,
} from "react-spring";
import SettingsPanel from "./components/Settings";
import SettingsLogo from "./svgComponents/SettingsSVG";

const BucketGame = React.lazy(() => import("./components/ThreeCanvas"));
const GameMessages = React.lazy(() => import("./components/GameMessages"));
const Loading = React.lazy(() => import("./components/Loading"));
const AnimatedPanel = a(SettingsPanel);

export const App: React.FC = () => {
    const page = useStore((state) => state.pageIndex);
    const init = useStore((state) => state.getGameData);
    const showingPanel = useStore((state) => state.settings.showingPanel);


    useEffect(() => {
        init();
    }, []);

    const settingsPanelTransition = useTransition(showingPanel, {
        from: { x: -100, opacity: 0 },
        enter: { x: 0, opacity: 1 },
        leave: { x: -100, opacity: 0 },
        config: springConfig.molasses,
    });

    return (
        <PageHolder>
            <GlobalFonts />
            <Suspense fallback={null}>
                {page === Page.LOADING && <Loading />}

                {page === Page.GAME && (
                    <PageHolder>
                        <BucketGame />
                        <SettingsLogo />

                        {settingsPanelTransition(
                            ({ x, opacity }, isShowing) =>
                                isShowing && (
                                    <AnimatedPanel
                                        style={{
                                            opacity,
                                            transform: `translate(${x}%)`,
                                        }}
                                    />
                                )
                        )}
                        <GameMessages />
                    </PageHolder>
                )}
                {page === Page.LOADING && <Loading />}
            </Suspense>
        </PageHolder>
    );
};
