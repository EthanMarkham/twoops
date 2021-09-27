import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
    TransitionFn,
    animated,
    TransitionRenderFn,
    SpringValue,
} from "react-spring";
import useStore, { ChatInfo } from "../store";
import {
    CancelButton,
    Container,
    Footer,
    NavBar,
    SaveButton,
    SettingsTable,
    Body,
    TableHeader,
} from "../styles/settings";
import SettingsInput from "./SettingsInput";

const AnimatedContainer = animated(Container);

interface SettingsProps {
    style: {
        transform: SpringValue<string>;
    };
}
const SettingsPanel = ({ style }: SettingsProps) => {
    const settings = useStore((state) => state.settings);
    const togglePanel = useStore((state) => state.toggleSettings);
    const updateSettings = useStore((state) => state.updateSettings);
    const [chatCopy, setChatCopy] = useState<ChatInfo>(settings.chat); //copy context to state
    const [editableText, setEditable] = useState<string[]>([]);

    const updateChat = useCallback(() => {
        setChatCopy(settings.chat);
        setEditable(
            Object.keys(chatCopy).filter(
                (k) => typeof chatCopy[k as keyof ChatInfo] == "string"
            )
        );
    }, [settings.chat]);
    useEffect(() => {updateChat}, [updateChat]);


    
    const saveUpdates = useCallback(() => {
        updateSettings({
            ...settings,
            chat: chatCopy,
        });
        togglePanel();
    }, [chatCopy]);

    const setText = useCallback(
        (value: string, key: string): void => {
            setChatCopy((current) => ({
                ...current,
                [key]: value,
            }));
        },
        [chatCopy, editableText]
    );

    return (
        <AnimatedContainer style={style}>
            <NavBar>
                <CancelButton onClick={togglePanel} />
            </NavBar>
            <Body>
                <SettingsTable>
                    <TableHeader>Chat</TableHeader>
                    {editableText.map((k, i) => (
                        <SettingsInput
                            key={`input${i}`}
                            col={i % 2}
                            row={1 + Math.ceil((i + 1) / 2)}
                            label={k}
                            text={
                                typeof chatCopy[k as keyof ChatInfo] ===
                                "string"
                                    ? (chatCopy[k as keyof ChatInfo] as string)
                                    : "error"
                            }
                            audioIsEnabled={false}
                            setText={(value: string) => {
                                setText(value, k);
                            }}
                        />
                    ))}
                </SettingsTable>
                <SettingsTable>
                    <TableHeader>Colors</TableHeader>
                    {editableText.map((k, i) => (
                        <SettingsInput
                            key={`input${i}`}
                            col={i % 2}
                            row={1 + Math.ceil((i + 1) / 2)}
                            label={k}
                            text={
                                typeof chatCopy[k as keyof ChatInfo] ===
                                "string"
                                    ? (chatCopy[k as keyof ChatInfo] as string)
                                    : "error"
                            }
                            audioIsEnabled={false}
                            setText={(value: string) => {
                                setText(value, k);
                            }}
                        />
                    ))}
                </SettingsTable>
            </Body>

            <Footer>
                <SaveButton onClick={saveUpdates}>UPDATE SETTINGS</SaveButton>
            </Footer>
        </AnimatedContainer>
    );
};

export default SettingsPanel;
