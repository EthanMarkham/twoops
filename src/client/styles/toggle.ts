import styled from "styled-components";

export const ToggleHolder = styled.label<{
    toggle?: boolean;
    gridPos?: [number | string, number | string];
    width?: number | string;
    height?: number | string;
}>`
    ${({ gridPos }) =>
        gridPos &&
        `grid-column: ${gridPos[0]};
        grid-row: ${gridPos[1]};
    `}
    ${({ height }) => height && `height: ${height};`}
    ${({ width }) => width && `width: ${width};`}

    position: relative;
    display: inline-block;
    width: 125%;
    height: 50px;

    border-radius: 15px;
    transition: 0.4s;
    border-radius: 15px;
`;

export const ToggleBackground = styled.span<{
    toggle?: boolean;
}>`
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #1d1d1d;
    -webkit-tap-highlight-color: transparent;

    border-radius: 60px;
    transition: 0.4s;
`;

export const ToggleSlider = styled.div<{
    slideAmount: number;
    toggle?: boolean;
}>`
    content: "";
    z-index: 2;
    position: absolute;
    left: 2%;
    top: 9%;
    height: 82%;
    aspect-ratio: 76.48 / 42.17;

    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    text-transform: uppercase;

    border-radius: 60px;

    background-color: ${({ toggle }) => (toggle ? "#FFCF11" : "#8B8B8B")};
    color: ${({ toggle }) => (toggle ? "#1D1D1D" : "#C8C8C8")};
    font-weight: bold;
    font-size: 18px;
    cursor: pointer;

    transition: 0.4s;

    ${({ toggle, slideAmount }) =>
        toggle && `transform: translateX(calc(${slideAmount}px - 12%));`}

    user-select: none;
`;
