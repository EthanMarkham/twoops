import React, { Suspense, useEffect, useState } from "react";
import useStore, { Page } from "./store";
import { PageHolder, SettingsLogo } from "./styles";
import GlobalFonts from "./styles/fonts";
import { useSpring, animated as a, config as springConfig } from "react-spring";

const BucketGame = React.lazy(() => import("./components/ThreeCanvas"));
const GameMessages = React.lazy(() => import("./components/GameMessages"));
const Loading = React.lazy(() => import("./components/Loading"));

const AnimatedLogo = a(SettingsLogo);

export const App: React.FC = () => {
    const page = useStore((state) => state.pageIndex);
    const init = useStore((state) => state.getGameData);
    const [showingSettings, setSettingsShow] = useState<boolean>(true);

    useEffect(() => {
        init();

        setTimeout(() => {
            setSettingsShow(false);
        }, 2000);
    }, []);

    const settingsSpring = useSpring({
        from: { opacity: showingSettings ? 1 : 0 },
        to: { opacity: showingSettings ? 0 : 1 },
        config: springConfig.molasses,
    });

    const renderPage = (page: Page) => {
        switch (page) {
            case Page.LOADING:
                return <Loading />;
            case Page.GAME:
                return (
                    <PageHolder>
                        <AnimatedLogo style={settingsSpring} />
                        <BucketGame />
                        <GameMessages />
                    </PageHolder>
                );
            default:
                throw new Error("No Page Index Set");
        }
    };

    return (
        <PageHolder>
            <GlobalFonts />
            <Suspense fallback={null}>{renderPage(page)}</Suspense>
        </PageHolder>
    );
};
