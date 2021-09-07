import React, { Suspense, useEffect } from 'react';
import useStore  from '../../store';
import { Canvas } from '@react-three/fiber';
import { Physics, Triplet  } from '@react-three/cannon';
import Environment from './components/Enviroment';
import Ball from './components/Ball';
import Hoop from './components/Hoop';
import { Socket } from 'socket.io-client';

interface ShotData {
    user: string,
    shot: {
        x: number, 
        y: number,
        z: number,
    }
}

const Scene = (_props: any) => {
    const { ballSpawn, alphaChannel } = useStore(state => state.settings);
    const socket: Socket = useStore(state => state.socket);
    const channel = useStore(state => state.settings.channel);
    const setShot: (user: string, value: Triplet) => void = useStore(state => state.setShot);

    
    useEffect(() => {
        socket.emit("JOIN_CHANNEL", channel)
        socket.on("NEW_SHOT", ({user, shot}: ShotData) => {
            console.log('hooked shot', user, shot);
            setShot(user, [shot.x, shot.y, shot.z])
        })
        return () => {
            socket.off("NEW_SHOT");
            socket.emit("LEAVE_CHANNEL", channel)
        }
    }, []);

    return (
        <Canvas
            style={{
                width: '100%',
                margin: 0,
                height: '100%',
                backgroundColor: alphaChannel,
                overflow: 'hidden'
            }}
            frameloop="demand"
            >
            <Physics>
                <Environment ballPosition={ballSpawn} />
                <Suspense fallback={null}>
                    <Hoop />
                    <Ball />
                </Suspense>
            </Physics>
        </Canvas>
    )
}

export default Scene;
