import React from "react";
import { ChatInfo } from "../../../store";
import { SettingsTable, TableHeader } from "../../../styles/settings";
import BooleanInput from "../inputs/BooleanInput";
import TextInput from "../inputs/TextInput";

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
            <TableHeader>Chat</TableHeader>
            {keyMap.map(({ key, value, type }, i) => {
                switch (type) {
                    case "string":
                        return (
                            <TextInput
                                key={`input${i}`}
                                gridPos={[i % 2, 1 + Math.ceil((i + 1) / 2)]}
                                label={key}
                                text={value.toString()}
                                audioIsEnabled={false}
                                setText={(value: string) => {
                                    updateState(value as string, key);
                                }}
                            />
                        );
                    case "boolean":
                        return (
                            <BooleanInput
                                key={`input${i}`}
                                gridPos={[i % 2, 1 + Math.ceil((i + 1) / 2)]}
                                label={key}
                                isChecked={Boolean(value)}
                                setValue={(value: boolean) => {
                                    updateState(value as boolean, key);
                                }}
                            />
                        );
                }
            })}
        </SettingsTable>
    );
}

export default ChatInput;
