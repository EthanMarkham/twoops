import React, { Suspense, useEffect, useState } from "react";
import useStore, { Page } from "./store";
import { PageHolder } from "./styles";
import GlobalFonts from "./styles/fonts";
import SettingsLogo from "./svgComponents/SettingsSVG";
import { _roots } from "@react-three/fiber";
import useMouseEntered from "./hooks/useMouseEntered";

const BucketGame = React.lazy(() => import("./components/canvas/ThreeCanvas"));
const GameMessages = React.lazy(() => import("./components/GameMessages"));
const Loading = React.lazy(() => import("./components/Loading"));
const SettingsPanel = React.lazy(
    () => import("./components/settings/Settings")
);

export const App: React.FC = () => {
    const page = useStore((state) => state.pageIndex);
    const init = useStore((state) => state.getGameData);
    const body = React.useRef() as React.MutableRefObject<HTMLDivElement>;
    const mouseEntered = useMouseEntered(body);

    useEffect(init, []);

    return (
        <PageHolder ref={body}>
            <GlobalFonts />
            <Suspense fallback={null}>
                {page === Page.LOADING && <Loading />}

                {page === Page.GAME && (
                    <PageHolder>
                        <BucketGame />
                        <SettingsLogo mouseEntered={mouseEntered} />
                        <SettingsPanel />
                        <GameMessages />
                    </PageHolder>
                )}
                {page === Page.LOADING && <Loading />}
            </Suspense>
        </PageHolder>
    );
};
