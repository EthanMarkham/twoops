import styled from "styled-components";
import { animated } from "react-spring";

export const PageHolder = styled("div")<{
    center?: boolean;
}>`
    width: 100%;
    height: 100%;
    ${(props) => props.center && flexCenter}
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

export const scrollbar = `
    &::-webkit-scrollbar {
        width: 14px;
    }
    
    &::-webkit-scrollbar-thumb {
        border: 4px solid rgba(0, 0, 0, 0);
        background-clip: padding-box;
        border-radius: 9999px;
        background-color: #AAAAAA;
    }
    &::-webkit-scrollbar-thumb:window-inactive {
        background: rgba(0, 0, 0, 0.2); 
    }
`;
export const flexCenter = `
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
`;
