import React from "react";
import styled from "styled-components";

const Container = styled.div`
    width: 100%;
    height: 75.46px;
    display: flex;
    background: #ffcf11;
    justify-content: center;
    align-content: center;
`;
const SaveButton = styled.button`
    background: transparent;
    width: 100%;
    height: 100%;
    text-align: center;
    margin: auto;
    outline: none;
    border: none;
    font-weight: bold;
    font-size: 18px;
    color: #000000;
`;

interface FooterProps {
    onSave: () => void;
}

const Footer = ({ onSave }: FooterProps) => {
    return (
        <Container>
            <SaveButton onClick={onSave}>UPDATE SETTINGS</SaveButton>
        </Container>
    );
};

export default Footer;
