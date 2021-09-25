import { Triplet} from "@react-three/cannon";
import React from "react";
import useFloor from "../hooks/useFloor";

interface EnvironmentProps {
    ballPosition: Triplet;
}

const Environment = ({ballPosition}: EnvironmentProps) => {
    useFloor(ballPosition);
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
