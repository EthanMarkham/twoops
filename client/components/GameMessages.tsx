import React, { useMemo, useState, useEffect } from 'react';
import { useTransition, config, useSpring } from 'react-spring';
import useStore from '../store';
import { InfoBox, ShotLabel, AttemptCount, MessageBox, Bucket, Airball, Brick, MessageText, Wrapper, BucketLabel, BucketFiller } from '../styles/gameMessages';

const WIN = "WIN";
const AIRBALL = "AIRBALL";
const BRICK = "BRICK";

interface GameMessage {
    showing: boolean,
    user: string,
    state: string,
}

const getMessage = (isShowing: boolean, user: string | null, success: boolean, isAirball: boolean): GameMessage => ({
    showing: isShowing,
    user: user ? user : "",
    state: success ? WIN : isAirball ? AIRBALL : BRICK,
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
        enter: item => ({
            opacity: 1,
            transform: `scale(${item && item.state === WIN ? 2 : 1})`,
            top: !!item && item.state === WIN ? '200px' : '50px'
        }),
        leave: { opacity: 0 },
        config: config.molasses
    });

    const roundTransition = useTransition(message.showing, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: {
            duration: 800,
            delay: 600
        }
    })
    return (
        <Wrapper>
            {messageTransition((props: any, item: GameMessage) =>
                item.showing && <MessageBox style={props}>
                    <MessageText response={item.state}>
                        {item.state === WIN ? null :
                            <div>
                                {item.state === AIRBALL ? "OOOOOOOOF!" : "CLONK!"}
                            </div>}
                        <div>
                            {item.user.toUpperCase()} !SHOT A{item.state === AIRBALL && "N"}
                        </div>
                    </MessageText>
                    {item.state === WIN ? <Bucket /> : item.state === AIRBALL ? <Airball /> : <Brick />}
                </MessageBox>
            )}


            {/* <BucketLabel src="/assets/img/bucketLabel.png" /> */}
            {roundTransition((style: any, item: boolean) => (
                <InfoBox>
                    {item && <AttemptCount style={style}>{attempts}</AttemptCount>}
                    <ShotLabel>!SHOT</ShotLabel>
                    {item && <BucketFiller style={style}>since the last</BucketFiller>}
                    {item && <BucketLabel style={style}>BUCKET</BucketLabel>}
                </InfoBox>
            ))}

        </Wrapper>
    )
}

export default GameMessages;