import React from "react";
import styled from "styled-components";
import { flexCenter } from "../../../styles";

export const Container = styled.div<{
    isActive: boolean;
}>`
    padding: 0 10px;
    width: fit-content;
    height: 100%;
    color: ${({ isActive }) => (isActive ? "#FFCF11" : "white")};
    ${({ isActive }) => isActive && "border-bottom: 3px solid #FFCF11"};
    ${flexCenter}
`;
interface NavBarProps {
    text: string;
    isActive: boolean;
    onClick(): void;
}

const NavLink = ({ text, onClick, isActive }: NavBarProps) => {
    return (
        <Container
            isActive={isActive}
            onClick={() => {
                !isActive && onClick();
            }}
        >
            {text}
        </Container>
    );
};

export default NavLink;
