import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
    TransitionFn,
    animated,
    TransitionRenderFn,
    SpringValue,
} from "react-spring";
import useStore, { ChatInfo } from "../../store";
import {
    Container,
    Footer,
    SaveButton,
    SettingsTable,
    Body,
    TableHeader,
} from "../../styles/settings";
import SettingsInput from "./SettingsInput";
import NavBar from "./NavBar";
import ChatInput from "./ChatInput";

const AnimatedContainer = animated(Container);

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
    const [editableText, setEditable] = useState<string[]>([]);
    const [sectionINDEX, setSectionIndex] = useState<SECTION>(SECTION.CHAT);

    const updateChat = useCallback(() => {
        setChatCopy(settings.chat);
        setEditable(
            Object.keys(chatCopy).filter(
                (k) => typeof chatCopy[k as keyof ChatInfo] == "string"
            )
        );
    }, [settings.chat]);
    useEffect(() => {
        updateChat;
    }, [updateChat]);

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
        [chatCopy, editableText]
    );

    return (
        <AnimatedContainer style={style}>
            <NavBar index={sectionINDEX} onCancel={() => togglePanel()} />
            <Body>
                <ChatInput chatCopy={chatCopy} updateState={updateChatState} />
            </Body>

            <Footer>
                <SaveButton onClick={saveUpdates}>UPDATE SETTINGS</SaveButton>
            </Footer>
        </AnimatedContainer>
    );
};

export default SettingsPanel;
