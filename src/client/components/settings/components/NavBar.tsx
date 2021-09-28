import React, { useMemo, useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { flexCenter } from "../../../styles";
import CancelSVG from "../../../svgComponents/CancelSVG";
import LogoutSVG from "../../../svgComponents/LogoutSVG";
import { SECTION } from "../Settings";

import NavLink from "./NavLink";

const Container = styled.div`
    width: calc(100% - 32px);
    padding: 16px;
    height: 85.32px;
    background: #1d1d1d;

    ${flexCenter}
    flex-direction: row;
    justify-content: space-between;
`;

const NavLinkHolder = styled.div`
    padding: 16px;
    height: 85.32px;
    ${flexCenter}
    gap: 12px;
`;

interface NavBarProps {
    index: SECTION;
    onCancel: () => void;
}

const NavBar = ({ index, onCancel }: NavBarProps) => {
    return (
        <Container>
            <CancelSVG onClick={onCancel} />
            <NavLinkHolder>
                {Object.keys(SECTION).map((s, i) => (
                    <NavLink
                        key={`link${i}`}
                        text={s}
                        isActive={s === index}
                        onClick={function (): void {
                            throw new Error("Function not implemented.");
                        }}
                    />
                ))}
            </NavLinkHolder>
            <LogoutSVG />

        </Container>
    );
};

export default NavBar;
