import { animated } from "@react-spring/web";
import { HexColorPicker } from "react-colorful";
import styled from "styled-components";
import { flexCenter, primaryText } from ".";

export const ColorDropDown = styled.div<{
    expanded: boolean;
}>`
    background: #1d1d1d;
    width: 95%;
    border-radius: 4px;
    margin: auto;
    grid-column: 1 / 3;
    padding: 5px;
    gap: 5px;
    position: relative;
    height: fit-content;
    ${flexCenter}
    flex-direction: column;
`;

export const ColorInfo = styled.div`
    gap: 10px;
    height: 100%;
    ${flexCenter}
`;

export const Row = styled.div`
    gap: 10px;
    width: 90%;
    display: flex;
    -webkit-box-pack: center;
    place-content: center;
    -webkit-box-align: center;
    align-items: center;
    justify-content: space-between;
`;

export const ColorLabel = styled.span`
    ${primaryText}
`;

export const ColorExample = styled.div<{
    color: string;
}>`
    background: ${({ color }) => color};
    height: 40px;
    aspect-ratio: 1;
`;

export const ColorPickerHolder = styled(animated('div'))`
    width: 100%;
    height: 220px;
    overflow: hidden;
    ${flexCenter}
`;

export const ColorPicker = styled(HexColorPicker)`
    width: 90% !important;
    height: 200px !important;
    margin: auto;
`;
