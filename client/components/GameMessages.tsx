import React, { useMemo, useState, useEffect } from 'react';
import { useTransition, config } from 'react-spring';
import useStore from '../store';
import { InfoBox, RoundInfo, AttemptCount, MessageBox, SvgHolder, MessageText, Wrapper } from '../styles/gameMessages';

const WIN = "WIN";
const AIRBALL = "AIRBALL";
const BRICK = "BRICK";

interface GameMessage {
    showing: boolean,
    user: string,
    state: string,
    text: string,
}

const getMessage = (isShowing: boolean, user: string | null, success: boolean, isAirball: boolean): GameMessage => ({
    showing: isShowing,
    user: user ? user : "",
    state: success ? WIN : isAirball ? AIRBALL : BRICK,
    text: success ? "NICE" : isAirball ? "OOOOOOOOF!" : "CLONK!",
})

const GameMessages = (props: any) => {
    const user = useStore(state => state.roundInfo.shot.user);
    const { success, isAirball, showing } = useStore(state => state.roundInfo.results);
    const attempts = useStore(state => state.roundInfo.attempts);

    const [message, setMessage] = useState<GameMessage>(getMessage(false, "", false, false));

    useEffect(() => {
        if (showing) {
            setMessage(getMessage(true, user, success, isAirball));
            setTimeout(() => setMessage(getMessage(false, "", false, false)), 5000);
        }
    }, [showing, user, success, isAirball])


    const messageTransition = useTransition(message, {
        from: { opacity: 0 },
        enter: item => ({ opacity: 1, transform: `scale(${item && item.state === WIN ? 2 : 1})`, top: !!item && item.state === WIN ? '200px' : '50px' }),
        leave: { opacity: 0 },
        config: config.molasses
    });

    return (
        <Wrapper>
            {messageTransition((props: any, item: GameMessage) =>
                item.showing && <MessageBox style={props}>
                    <MessageText response={item.state}>
                        {item.state === WIN ? null : <div>{item.text}</div>}
                        <div>{item.user.toUpperCase()} !SHOT A{item.state === AIRBALL && "N"}</div>
                    </MessageText>
                    <SvgHolder
                        isBucket={item.state === WIN}
                        src={
                            item.state === WIN
                                ? '/assets/svg/bucket.svg' : item.state === AIRBALL
                                    ? '/assets/svg/airball.svg' : '/assets/svg/brick.svg'
                        } />
                </MessageBox>
            )}

            <InfoBox>
                <AttemptCount>{attempts}</AttemptCount>
                <RoundInfo src="/assets/svg/roundInfo.svg" />
            </InfoBox>
        </Wrapper>
    )
}

export default GameMessages;