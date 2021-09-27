import React from "react";
import styled from "styled-components";
import AudioIconSVG from "../svgComponents/AudioIconSVG";

const Container = styled.div<{
    column: number;
    row: number;
}>`
    position: relative;
    width: 100%;
    overflow-x: none;
    grid-column-start: ${(props) => props.column};
    grid-row-start: ${(props) => props.row};

    display: grid;
    gap: 0.7em;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 4fr;
`;

const Label = styled.div`
    grid-column-start: 1;
    grid-row-start: 1;

    height: 100%;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #cccccc;
    user-select: none;
`;

const AudioIconHolder = styled.div`
    grid-column-start: 2;
    grid-row-start: 1;

    height: 100%;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: #cccccc;
`;

const ChatInput = styled.textarea`
    grid-column-start: 1;
    grid-column-end: 3;

    grid-row-start: 2;

    font-size: 18px;
    color: #ffffff;
    overflow-wrap: break-word;
    padding: 0.6em;

    display: flex;
    align-items: center;
    background: #1d1d1d;
    border-radius: 4px;
`;
interface ChatSettingInputProps {
    label: string;
    text: string;
    audioIsEnabled: Boolean;
    setText(value: string): void;
    col: number;
    row: number;
}
const ChatSettingInput = ({
    label,
    text,
    audioIsEnabled,
    setText,
    col,
    row,
}: ChatSettingInputProps) => {
    const onAudio = () => {};
    return (
        <Container column={col} row={row}>
            <Label>
                {label
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
            </Label>
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
        </Container>
    );
};

export default ChatSettingInput;
