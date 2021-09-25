import React, { Suspense, useEffect } from "react";
import useStore from "../store";
import { Canvas } from "@react-three/fiber";
import { Physics, Triplet } from "@react-three/cannon";
import Environment from "./Environment";
import Ball from "./BallLowPoly";
import Hoop from "./Hoop";
import { Socket } from "socket.io-client";
import { ShotInfo } from "../../server/types/game";
import CameraController from "../hooks/CameraController";

const Scene = (_props: any) => {
    const { ballSpawn, alphaChannel } = useStore((state) => state.settings);
    const socket: Socket = useStore((state) => state.socket);
    const channel = useStore((state) => state.settings.channel);
    const setShot: (user: string, value: Triplet) => void = useStore(
        (state) => state.setShot
    );
    useEffect(() => {
        socket.emit("JOIN_CHANNEL", channel);

        socket.on("NEW_SHOT", ({ user, shot }: ShotInfo) => {
            socket.emit("ACKNOWLEDGED_SHOT", channel);
            console.log("hooked shot", user, shot);
            console.log("hooked at " + new Date().getTime());

            setShot(user, [shot.x, shot.y, shot.z]);
        });
        return () => {
            socket.off("NEW_SHOT");
            socket.emit("LEAVE_CHANNEL", channel);
        };
    }, []);

    return (
        <Canvas
            style={{
                width: "100%",
                margin: 0,
                height: "100%",
                backgroundColor: alphaChannel,
                overflow: "hidden",
            }}
            frameloop="always"
        >
            <Physics>
                <CameraController />
                <Environment ballPosition={ballSpawn} />
                <Suspense fallback={null}>
                    <Hoop />
                    <Ball />
                </Suspense>
            </Physics>
        </Canvas>
    );
};

export default Scene;
