import { HexColorPicker } from "react-colorful";
import { animated } from "react-spring";
import styled from "styled-components";
import { scrollbar } from ".";


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
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;

    ${scrollbar}

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
    height: 80px;

    font-size: 18px;
    color: #ffffff;
    overflow-wrap: break-word;
    padding: 0.6em;

    ${scrollbar}
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1d1d1d;
    border-radius: 4px;
`;

export const ColorPicker = styled(HexColorPicker)`
    grid-column-start: 1;
    grid-column-end: 3;

    grid-column: 1 / 3;
    width: 80% !important;
    height: 200px !important;
    margin: auto;
`;

export const SettingsTable = styled.div`
    display: grid;
    position: relative;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: min-content;
    height: fit-content;
    width: 100%;
    gap: 20px;
    border-bottom: 1px solid #ffffff50;
    padding-bottom: 50px;
`;
export const TableHeader = styled.div`
    grid-column: 1 / 3;
    grid-row: 1;
    display: flex;
    align-items: flex-end;
    height: 40px;
    color: white;
`;
