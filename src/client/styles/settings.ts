import { animated } from "react-spring";
import styled from "styled-components";

export const AnimatedContainer = styled(animated.div)`
    position: absolute;
    display: flex;
    flex-direction: column;

    width: 807.13px;
    height: 2534.27px;
    left: 0px;
    top: 0px;
    z-index: 101;

    font-family: Open Sans;

    background: linear-gradient(0deg, #313131, #313131), #c4c4c4;
    box-shadow: 44px 0px 30px rgba(0, 0, 0, 0.3);
`;

export const Body = styled.div`
    height: calc(100vh - 240.78px);
    width: calc(100% - 40px);
    margin: 20px;
    display: flex;
    flex-direction: row;
    overflow-x: hidden;
    overflow-y: auto;
`;

export const InputContainer = styled.div<{
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
    grid-auto-rows: min-content;
`;

export const InputLabel = styled.div`
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

export const AudioIconHolder = styled.div`
    grid-column-start: 2;
    grid-row-start: 1;

    height: 100%;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: #cccccc;
`;

export const ChatInput = styled.textarea`
    grid-column-start: 1;
    grid-column-end: 3;

    grid-row-start: 2;

    font-size: 18px;
    color: #ffffff;
    overflow-wrap: break-word;
    padding: 0.6em;
    
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1d1d1d;
    border-radius: 4px;
`;
