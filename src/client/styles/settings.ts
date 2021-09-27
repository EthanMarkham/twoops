import styled from "styled-components";

export const Container = styled.div`
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


export const Footer = styled.div`
    width: 100%;
    height: 75.46px;
    display: flex;
    background: #FFCF11;
    justify-content: center;
    align-content: center;
`;

export const SaveButton = styled.button`
    background: transparent;
    width: 100%;
    height: 100%;
    text-align: center; 
    margin: auto;
    outline: none;
    border: none;
    font-weight: bold;
    font-size: 18px;
    color: #000000;`

export const Body = styled.div`
    height: calc(100vh - 240.78px);
    width: calc(100% - 40px);
    margin: 20px;
    display: flex;
    flex-direction: row;
    overflow-x: hidden;
    overflow-y: auto;
`
export const SettingsTable = styled.div`
    display: grid;
    position: relative;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: min-content;
    height: fit-content;
    width: 100%;
    gap: 20px;
    border-bottom: 1px solid #FFFFFF50;
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



export const LogoContainer = styled.svg`
    position: fixed;
    z-index: 100;
    width: fit-content;
    bottom: 10%;
    left: 5%;
    transform: scale(5);
`;
