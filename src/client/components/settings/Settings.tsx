import React, { useMemo, useState, useEffect, useCallback } from "react";
import { SpringValue } from "react-spring";
import useStore, { ChatInfo, ColorInfo } from "../../store";

import ChatInput from "./tables/ChatInput";
import { AnimatedContainer, Body } from "../../styles/settings";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ColorsInput from "./tables/ColorsInput";

interface SettingsProps {
    style: {
        transform: SpringValue<string>;
    };
}

export enum SECTION {
    CHAT = "CHAT",
    COLORS = "COLORS",
    POSITION = "POSITION",
}

const SettingsPanel = ({ style }: SettingsProps) => {
    const settings = useStore((state) => state.settings);
    const togglePanel = useStore((state) => state.toggleSettings);
    const updateSettings = useStore((state) => state.updateSettings);

    const [chatCopy, setChatCopy] = useState<ChatInfo>(settings.chat); //copy context to state
    const [colorCopy, setColorCopy] = useState<ColorInfo>(settings.colors); //copy context to state
    const [sectionIndex, setSectionIndex] = useState<SECTION>(SECTION.CHAT);

    useEffect(() => setChatCopy(settings.chat), [settings.chat]);

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
    return (
        <AnimatedContainer style={style}>
            <NavBar index={sectionIndex} onCancel={() => togglePanel()} />
            <Body>
                <ChatInput chatCopy={chatCopy} updateState={updateChatState} />
                <ColorsInput colorCopy={colorCopy} updateState={updateColorState} />
            </Body>
            <Footer onSave={() => saveUpdates()} />
        </AnimatedContainer>
    );
};

export default SettingsPanel;
