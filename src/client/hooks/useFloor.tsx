import { Triplet, useBox, usePlane } from "@react-three/cannon";

const useFloor = (ballPosition: Triplet) => {
    const standPosition: Triplet = [
        ballPosition[0],
        ballPosition[1] - 2,
        ballPosition[2],
    ]

        //FLOOR
        usePlane(() => ({
            position: [0, -30, 0],
            type: "Static",
            rotation: [-Math.PI / 2, 0, 0],
            material: {
                friction: 0,
                restitution: 1.4,
            },
        }));
    
        //Stand
        useBox(() => ({
            position: standPosition,
            type: "Static",
            mass: 0,
            material: {
                friction: 0,
                restitution: 0.01,
            },
        }));

    return null;
}

export default useFloor