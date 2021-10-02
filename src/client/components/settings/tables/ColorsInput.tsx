import React from "react";
import { ColorInfo } from "../../../store";
import { SettingsTable, TableHeader } from "../../../styles/settings";
import ColorInput from "../inputs/ColorInput";

interface TableSectionInputProps {
    colorCopy: ColorInfo;
    updateState(value: any, key: keyof ColorInfo): void;
}

const ChatInput = React.forwardRef<HTMLDivElement, TableSectionInputProps>(
    ({ colorCopy, updateState }, ref) => {
        const keyMap = Object.keys(colorCopy).map((k) => ({
            key: k as keyof ColorInfo,
            value: colorCopy[k as keyof ColorInfo] as string,
        }));

        return (
            <SettingsTable ref={ref}>
                <TableHeader>Colors</TableHeader>
                {keyMap.map(({ key, value }, i) => (
                    <ColorInput
                        key={`input${i}`}
                        gridPos={[i % 2, 1 + Math.ceil((i + 1) / 2)]}
                        label={key}
                        value={value.toString()}
                        setColor={(value: string) => {
                            updateState(value, key);
                        }}
                    />
                ))}
                <div style={{height: '800px'}} />
            </SettingsTable>
        );
    }
);

export default ChatInput;
