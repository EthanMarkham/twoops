import React from "react";
import {
    InputContainer,
    InputLabel,
} from "../../../styles/settings";
import Toggle from "../../Toggle";

interface TextInputInputProps {
    label: string;
    isChecked: boolean;
    setValue(value: boolean): void;
    gridPos: [number, number];
}
const TextInput = ({
    label,
    isChecked,
    setValue,
    gridPos,
}: TextInputInputProps) => {
    return (
        <InputContainer column={gridPos[0]} row={gridPos[1]}>
            <InputLabel>
                {label
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
            </InputLabel>
            <Toggle toggle={isChecked} gridPos={[1, 2]} onClick={() => setValue(!isChecked)}/>
        </InputContainer>
    );
};

export default TextInput;
