import styled from "styled-components";
import { animated } from "react-spring";
import BucketSVG from "../svgComponents/BucketSVG";
import AirballSVG from "../svgComponents/AirballSVG";
import BrickSVG from "../svgComponents/BrickSVG";

export const InfoBox = styled.div`
    z-index: 5;
    top: 5px;
    right: 5%;
    width: 230px;
    height: 160px;
    position: absolute;

    display: grid;
    grid-template-rows: 40% 20 40%;
    grid-template-columns: 50% 50%;
    justify-content: center;
    gap: 2px;

    color: #ffffff;
    -webkit-text-stroke-color: black;
`;
export const ShotLabel = styled.div`
    font-size: 2.83rem;
    -webkit-text-stroke-width: 2px;
    grid-row-start: 1;
    grid-column-start: 2;
    padding-top: 20px;
`;
export const BucketLabel = styled(animated.div)`
    grid-row-start: 3;
    grid-column-start: 2;
`;
export const BucketFiller = styled(animated.div)`
    grid-row-start: 2;
    grid-column-start: 2;
`;
export const AttemptCount = styled(animated.div)`
    z-index: 6;
    text-align: right;
    font-size: 8.5rem;
    letter-spacing: 0.01em;
    -webkit-text-stroke-width: 3px;
    grid-row-start: 1;
    grid-row-end: 4;
    grid-column-start: 1;
`;
export const MessageBox = styled(animated.div)`
    padding: 5px;
    position: absolute;
    z-index: 5;
    top: 15px;
    right: calc(1% + 300px);

    width: 280px;
    height: 160px;

    //border: 1px solid black;
`;
export const Bucket = styled(BucketSVG)`
    position: relative;
    width: 80%;
    bottom: 70px;
    left: 10%;
`;

export const Airball = styled(AirballSVG)`
    position: relative;
    width: 80%;
    bottom: 30px;
    left: 10%;
`;

export const Brick = styled(BrickSVG)`
    position: relative;
    width: 80%;
    bottom: 30px;
    left: 10%;
`;
export const MessageText = styled("div")<{
    response: string;
}>`
    // border: 1px solid black;
    z-index: 6;
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 40%;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    & div {
        flex-basis: 50%;

        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        letter-spacing: 0.04em;
        line-height: 90%;
        color: #ffffff;

        -webkit-text-stroke-width: 1.8px;
        -webkit-text-stroke-color: black;
        text-shadow: ${({ response }) =>
            response === "WIN"
                ? "0px 0px 9px #FFBC00"
                : response === "AIRBALL"
                ? "0px 0px 9px #99D4FF"
                : "0px 0px 9px #F86542"};
    }
`;

export const Wrapper = styled.div`
    user-select: none;
    padding: 0;
    margin: 0;

    position: absolute;
    top: 0;
    left 0;
    
    width: 100%;
    height: 100%;

    font-family: 'Bison Bold';
    font-style: normal;
    font-weight: bold;
`;
