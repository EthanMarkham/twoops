import styled from "styled-components";
import { animated } from "react-spring";
import SettingsSVG from "../svgComponents/SettingsSVG";

export const PageHolder = styled("div")<{
    flex?: boolean;
    center?: boolean;
}>`
    width: 100%;
    height: 100%;
    ${(props) =>
        props.flex &&
        `
        display: flex;
    `}
    ${(props) =>
        props.center &&
        `
        justify-content: center;
        align-content: center;
        align-items: center;
    `}
`;

export const Img = styled("img")<{
    size?: {
        height?: string;
        width?: string;
    };
    max?: {
        height?: string;
        width?: string;
    };
    backgroundColor?: string;
}>`
    ${(props) =>
        props.size &&
        `
        ${props.size.width && `width: ${props.size.width};`}
        ${props.size.height && `height: ${props.size.width};`}
    `}
    ${(props) =>
        props.max &&
        `
        ${props.max.width && `max-width: ${props.max.width};`}
        ${props.max.height && `max-height: ${props.max.height};`}
    `}
    ${(props) =>
        props.backgroundColor &&
        `background-color: ${props.backgroundColor}
    `}
`;

export const AnimatedWrapper = styled(animated.div)`
    width: fit-content;
    height: fit-content;
`;

export const SettingsLogo = styled(SettingsSVG)`
    position: fixed;
    width: 40px;
    bottom: 30px;
    left: 5%;
`;
