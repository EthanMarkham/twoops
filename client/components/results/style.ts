import styled from 'styled-components';
import { animated } from 'react-spring';

export const InfoBox = styled.div`
    z-index: 5;
    padding: 5px;
    position: absolute;

    z-index: 5;
    top: 5px;
    right: 5%;
    padding: 10px 0px;
    width: 230px;
    height: 160px;

    filter: drop-shadow(0px 0px 9px #BCBCBC30);
`
export const RoundInfo = styled.img`
    position: absolute;
    width: 60%;
    right: 0;
`
export const AttemptCount = styled.div`
    z-index: 6;
    position: absolute;
    top: 4%;
    right: 50%;
    text-align: right;
    font-size: 8.5rem;
    display: flex;
    letter-spacing: 0.01em;
    color: #FFFFFF;
    -webkit-text-stroke-width: 3px;
    -webkit-text-stroke-color: black;
`
export const MessageBox = styled(animated.div)`
    padding: 5px;
    position: absolute; 
    z-index: 5;
    top: 15px;
    right: calc(1% + 300px);

    width: 280px;
    height: 160px;

    //border: 1px solid black;
`

export const SvgHolder = styled('img')<{
    isBucket?: boolean
}>`
    position: relative;
    width: 80%;
    bottom: ${props => props.isBucket ? `70px;` : `30px;`}
    left: 10%;
`

export const MessageText = styled("div") <{
    response: string
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
        color: #FFFFFF;
        
        -webkit-text-stroke-width: 1.8px;
        -webkit-text-stroke-color: black;
        text-shadow: ${props => props.response === "AIRBALL" ? '0px 0px 9px #99D4FF' : props.response === "WIN" ? '0px 0px 9px #FFBC00' : '0px 0px 9px #F86542'};
    }
`

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
`
