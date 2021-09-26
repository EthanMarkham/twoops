import styled from "styled-components";
import SettingsSVG from "../svgComponents/SettingsSVG";
import CancelSVG from "../svgComponents/CancelButtonSVG";

export const Container = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;

    width: 807.13px;
    height: 2534.27px;
    left: 0px;
    top: 0px;
    z-index: 101;

    background: linear-gradient(0deg, #313131, #313131), #c4c4c4;
    box-shadow: 44px 0px 30px rgba(0, 0, 0, 0.3);
`;

export const NavBar = styled.div`
    width: 100%;
    height: 125.32px;
    background: #1D1D1D;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-content: center;
`;

export const CancelButton = styled(CancelSVG)`
    z-index: 102;
`;

export const LogoContainer = styled.svg`
    position: fixed;
    z-index: 100;
    width: fit-content;
    bottom: 10%;
    left: 5%;
    transform: scale(5);
`;
