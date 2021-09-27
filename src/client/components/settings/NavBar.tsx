import React, { useMemo, useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import CancelSVG from "../../svgComponents/CancelButtonSVG";

import { SECTION } from "./Settings";

export const Container = styled.div`
    width: calc(100% - 40px);
    padding: 20px;
    height: 85.32px;
    background: #1d1d1d;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-content: center;
`;

export const CancelButton = styled(CancelSVG)`
    z-index: 102;
`;

interface NavBarProps {
    index: SECTION;
    onCancel: () => void;
}

const NavBar = ({ index, onCancel }: NavBarProps) => {
    return (
        <Container>
            <CancelButton onClick={onCancel} />
        </Container>
    );
};

export default NavBar;
