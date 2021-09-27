import React, { useMemo, useState, useEffect, useCallback } from "react";
import { SpringValue } from "react-spring";
import useStore, { ChatInfo } from "../../store";

import NavBar from "./NavBar";
import ChatInput from "./ChatInput";
import Footer from "./Footer";
import { AnimatedContainer, Body } from "../../styles/settings";

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
    const [sectionINDEX, setSectionIndex] = useState<SECTION>(SECTION.CHAT);

    useEffect(() => setChatCopy(settings.chat), [settings.chat]);

    const saveUpdates = useCallback(() => {
        updateSettings({
            ...settings,
            chat: chatCopy,
        });
        togglePanel();
    }, [chatCopy]);

    const updateChatState = useCallback(
        (value: any, key: string): void => {
            setChatCopy((current) => ({
                ...current,
                [key]: value,
            }));
        },
        [chatCopy]
    );

    return (
        <AnimatedContainer style={style}>
            <NavBar index={sectionINDEX} onCancel={() => togglePanel()} />
            <Body>
                <ChatInput chatCopy={chatCopy} updateState={updateChatState} />
            </Body>
            <Footer onSave={() => saveUpdates()} />
        </AnimatedContainer>
    );
};

export default SettingsPanel;
