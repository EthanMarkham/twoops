import React from "react";
import styled from "styled-components";
import AudioIconSVG from "../../svgComponents/AudioIconSVG";
import { InputContainer, InputLabel, AudioIconHolder, ChatInput } from "../../styles/settings";

interface TextInputInputProps {
    label: string;
    text: string;
    audioIsEnabled: Boolean;
    setText(value: string): void;
    gridPos: [number, number];
}
const TextInput = ({
    label,
    text,
    audioIsEnabled,
    setText,
    gridPos,
}: TextInputInputProps) => {
    const onAudio = () => {};
    return (
        <InputContainer column={gridPos[0]} row={gridPos[1]}>
            <InputLabel>
                {label
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
            </InputLabel>
            <AudioIconHolder>
                <AudioIconSVG
                    isEnabled={audioIsEnabled}
                    onClick={() => onAudio()}
                />
            </AudioIconHolder>
            <ChatInput
                maxLength={255}
                value={text}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    e.preventDefault();
                    setText(e.target.value);
                }}
                contentEditable={true}
            />
        </InputContainer>
    );
};

export default TextInput;
