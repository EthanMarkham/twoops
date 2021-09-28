import { config, useTransition } from "@react-spring/core";
import React, { useState } from "react";
import {
    ColorPicker,
    ColorDropDown,
    ColorLabel,
    ColorInfo,
    ColorExample,
    Row,
    ColorPickerHolder,
} from "../../../styles/colorInput";
import { InputContainer, InputLabel } from "../../../styles/settings";
import CancelSVG from "../../../svgComponents/CancelSVG";

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
    gridPos,
}: ColorInputInputProps) => {
    const [isExpanded, setExpanded] = useState<boolean>(false);

    const colorPickerTransition = useTransition(isExpanded, {
        enter: { height: "220px" },
        from: { height: "0px" },
        leave: { height: "0px" },
        config: config.gentle,
    });
    return (
        <InputContainer column={gridPos[0]} row={gridPos[1]}>
            <InputLabel>
                {label
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
            </InputLabel>
            <ColorDropDown expanded={isExpanded}>
                <Row>
                    <ColorInfo onClick={() => setExpanded(!isExpanded)}>
                        <ColorExample color={value} />
                        <ColorLabel>{value}</ColorLabel>
                    </ColorInfo>
                    {isExpanded ? (
                        <CancelSVG
                            style={{ justifySelf: "flex-end" }}
                            onClick={() => setExpanded(false)}
                        />
                    ) : null}
                </Row>

                {colorPickerTransition(
                    (style, expanded) =>
                        expanded && (
                            <ColorPickerHolder style={style}>
                                <ColorPicker
                                    color={value}
                                    onChange={(newColor) => setColor(newColor)}
                                />
                            </ColorPickerHolder>
                        )
                )}
            </ColorDropDown>
        </InputContainer>
    );
};

export default ColorInput;
