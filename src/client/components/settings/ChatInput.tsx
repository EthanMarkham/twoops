import React from "react";
import styled from "styled-components";
import { ChatInfo } from "../../store";
import SettingsInput from "./SettingsInput";
import TextInput from "./SettingsInput";

const SettingsTable = styled.div`
    display: grid;
    position: relative;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: min-content;
    height: fit-content;
    width: 100%;
    gap: 20px;
    border-bottom: 1px solid #ffffff50;
    padding-bottom: 50px;
`;
const TableHeader = styled.div`
    grid-column: 1 / 3;
    grid-row: 1;
    display: flex;
    align-items: flex-end;
    height: 40px;
    color: white;
`;

interface TableSectionInputProps {
    chatCopy: ChatInfo;
    updateState(value: any, key: keyof ChatInfo): void;
}

function ChatInput({ chatCopy, updateState }: TableSectionInputProps) {
    const keyMap = Object.keys(chatCopy).map((k) => ({
        key: k as keyof ChatInfo,
        value: chatCopy[k as keyof ChatInfo],
        type: typeof chatCopy[k as keyof ChatInfo],
    }));

    return (
        <SettingsTable>
            <TableHeader>Colors</TableHeader>
            {keyMap.map(({ key, value, type }, i) => (
                <SettingsInput
                    key={`input${i}`}
                    col={i % 2}
                    row={1 + Math.ceil((i + 1) / 2)}
                    label={key}
                    text={chatCopy[key] as string}
                    audioIsEnabled={false}
                    setText={(value: string) => {
                        updateState(value, key);
                    }}
                />
            ))}
        </SettingsTable>
    );
}

export default ChatInput;
