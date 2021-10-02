import React, { useMemo, useState, useEffect, useCallback } from "react";
import { config, SpringValue, useTransition } from "react-spring";
import useStore, { ChatInfo, ColorInfo } from "../../store";

import ChatInput from "./tables/ChatInput";
import { AnimatedContainer, Body } from "../../styles/settings";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ColorsInput from "./tables/ColorsInput";
import useScrollTo from "../../hooks/useScrollTo";
import { PageHolder } from "../../styles";

interface SettingsProps {}

export enum SECTION {
    CHAT = "CHAT",
    COLORS = "COLORS",
    POSITION = "POSITION",
}

const SettingsPanel = () => {
    const settings = useStore((state) => state.settings);
    const togglePanel = useStore((state) => state.toggleSettings);
    const updateSettings = useStore((state) => state.updateSettings);
    const showingPanel = useStore((state) => state.settings.showingPanel);

    const [chatCopy, setChatCopy] = useState<ChatInfo>(settings.chat); //copy context to state
    const [colorCopy, setColorCopy] = useState<ColorInfo>(settings.colors); //copy context to state

    useEffect(() => setChatCopy(settings.chat), [settings.chat]);

    const mainContainer =
        React.useRef() as React.MutableRefObject<HTMLDivElement>;
    const chatSection =
        React.useRef() as React.MutableRefObject<HTMLDivElement>;
    const colorSection =
        React.useRef() as React.MutableRefObject<HTMLDivElement>;

    const [currentSection, scrollTo] = useScrollTo(mainContainer, [
        { element: chatSection, id: SECTION.CHAT },
        { element: colorSection, id: SECTION.COLORS },
    ]);

    const saveUpdates = useCallback(() => {
        updateSettings({
            ...settings,
            chat: chatCopy,
            colors: colorCopy,
        });
        togglePanel();
    }, [chatCopy, colorCopy]);

    const updateChatState = useCallback(
        (value: any, key: string): void => {
            //console.log('setting ' + key + ' to ' + value);
            setChatCopy((current) => ({
                ...current,
                [key]: value,
            }));
        },
        [chatCopy]
    );

    const updateColorState = useCallback(
        (value: any, key: string): void => {
            //console.log('setting ' + key + ' to ' + value);
            setColorCopy((current) => ({
                ...current,
                [key]: value,
            }));
        },
        [colorCopy]
    );

    const settingsPanelTransition = useTransition(showingPanel, {
        from: { x: -100 },
        enter: { x: 0 },
        leave: { x: -100 },
        config: config.gentle,
    });

    return (
        <PageHolder>
            {settingsPanelTransition(
                ({ x }, isShowing) =>
                    isShowing && (
                        <AnimatedContainer
                            style={{
                                transform: x.to((x) => `translate(${x}%)`),
                            }}
                        >
                            <NavBar
                                index={currentSection as SECTION}
                                scrollTo={scrollTo}
                                onCancel={() => togglePanel()}
                            />
                            <Body ref={mainContainer}>
                                <ChatInput
                                    chatCopy={chatCopy}
                                    updateState={updateChatState}
                                    ref={chatSection}
                                />
                                <ColorsInput
                                    colorCopy={colorCopy}
                                    updateState={updateColorState}
                                    ref={colorSection}
                                />
                            </Body>
                            <Footer onSave={() => saveUpdates()} />
                        </AnimatedContainer>
                    )
            )}
        </PageHolder>
    );
};

export default SettingsPanel;
