import React from "react";
import { InputContainer, InputLabel, ColorPicker } from "../../../styles/settings";

interface ColorInputInputProps {
    label: string;
    value: string;
    setColor(value: string): void;
    gridPos: [number, number];
}
const ColorInput = ({
    label,
    value,
    setColor,
    gridPos
}: ColorInputInputProps) => {
    return (
        <InputContainer column={gridPos[0]} row={gridPos[1]}>
            <InputLabel>
                {label
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}: {value}
            </InputLabel>
            <ColorPicker
                color={value}
                onChange={(newColor) => setColor(newColor)}
            /> 
            
        </InputContainer>
    );
};

export default ColorInput;
