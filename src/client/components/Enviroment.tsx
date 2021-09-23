import { Triplet, useBox, usePlane } from "@react-three/cannon";
import { useThree } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";

interface EnvironmentProps {
    ballPosition: Triplet;
}
const Environment = ({ ballPosition }: EnvironmentProps) => {
    const standPosition = useRef<Triplet>([
        ballPosition[0],
        ballPosition[1] - 2,
        ballPosition[2],
    ] as Triplet);

    //Camera
    const { camera } = useThree();
    useEffect(() => {
        camera.position.set(0, 15, -20);
        camera.rotation.set(-Math.PI / 80, Math.PI, 0);
    }, [camera]);

    //FLOOR
    usePlane(() => ({
        position: [0, -30, 0],
        rotation: [-Math.PI / 2, 0, 0],
        material: {
            friction: 0,
            restitution: 1.4,
        },
    }));

    //Stand
    useBox(() => ({
        position: standPosition.current,
        type: "Static",
        mass: 0,
        material: {
            friction: 0,
            restitution: 0.01,
        },
    }));

    return (
        <group>
            <pointLight
                intensity={2}
                decay={2}
                rotation={[-Math.PI / 4, 0, 0]}
                position={[29, 15, -30]}
            />
            <spotLight
                intensity={4}
                angle={Math.PI / 8}
                penumbra={0.15}
                decay={2}
                color="#9942ff"
                rotation={[-Math.PI / 2, 0, 0]}
                position={[29, 0, -30]}
                scale={[2.83, 2.83, 2.83]}
            />
            <spotLight
                intensity={1}
                angle={Math.PI / 8}
                penumbra={0.15}
                decay={2}
                color="#ffb532"
                position={[-29, 20, -20]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={[2.83, 2.83, 2.83]}
            />
        </group>
    );
};

export default Environment;
