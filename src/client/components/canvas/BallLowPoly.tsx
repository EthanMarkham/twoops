import { useSphere } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useStore from "../../store";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

type GLTFResult = GLTF & {
    nodes: {
        BasketballSeams: THREE.Mesh;
        Basketball: THREE.Mesh;
    };
    materials: {
        BasketballSeams: THREE.MeshStandardMaterial;
        Basketball: THREE.MeshStandardMaterial;
    };
};

const Ball = (props: any) => {
    const { nodes, materials } = useGLTF(
        "/assets/models/ballLowPoly.glb"
    ) as GLTFResult;

    const settings = useStore((state) => state.settings);
    const { user, throwValues } = useStore((state) => state.roundInfo.shot);
    const setResults = useStore((state) => state.setResults);
    const newRound = useStore((state) => state.newRound);

    const [inProgress, setInProgress] = useState<boolean>(false);
    const [isAirball, setAirball] = useState<boolean>(true);
    const [topHitTime, setTopHitTime] = useState<number>(0);
    const [bottomHitTime, setBottomHitTime] = useState<number>(0);
    const [sentResults, setResultSent] = useState<boolean>(false);
    const [resetting, setResetting] = useState<boolean>(false);

    const [ref, api] = useSphere(() => ({
        mass: 1,
        position: settings.ballSpawn,
        onCollide: (e) => {
            if (!e.body.userData.id) return;
            switch (e.body.userData.id) {
                case "hoop":
                    setAirball(false);
                    break;
                case "hoop_trigger_top":
                    setTopHitTime(new Date().getTime());
                    break;
                case "hoop_trigger_bottom":
                    setBottomHitTime(new Date().getTime());
                    break;
                case "floor":
                    setResetting(true);
                    break;
            }
        },
        rotation: [0, Math.PI / -5, 0],
        material: { friction: 1, restitution: 0.5 },
        allowSleep: false,
    }));

    const resetGame = () => {
        setTopHitTime(0);
        setBottomHitTime(0);
        setInProgress(false);
        setAirball(true);
        setResultSent(false);
        setResetting(false);
        api.velocity.set(0, 0, 0);
        api.angularVelocity.set(0, 0, 0);
        api.position.set(
            settings.ballSpawn[0],
            settings.ballSpawn[1],
            settings.ballSpawn[2]
        );
    };

    const sendResults = useCallback(() => {
        if (!sentResults) {
            console.log("sending", topHitTime, bottomHitTime, isAirball);
            setResults(
                {
                    success:
                        topHitTime !== 0 &&
                        bottomHitTime !== 0 &&
                        topHitTime < bottomHitTime,
                    isAirball,
                },
                (newRoundData) => {
                    setTimeout(() => {
                        resetGame();
                        newRound(newRoundData);
                    }, 2000);
                }
            );
            setResultSent(false);
        }
    }, [topHitTime, bottomHitTime, isAirball, sentResults]);

    useEffect(() => {
        if (!inProgress && user !== "" && throwValues[0] !== 0) {
            setInProgress(true);
            api.applyImpulse(throwValues, [0, 0, throwValues[2] / 45]);
        }
    }, [inProgress, throwValues, user]);

    useEffect(() => {
        if (resetting) sendResults();
    }, [resetting, sendResults]);

    return (
        <group ref={ref} {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.BasketballSeams.geometry}
                material={materials.BasketballSeams}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Basketball.geometry}
                material={materials.Basketball}
            />
        </group>
    );
};

useGLTF.preload("/assets/models/ballLowPoly.glb");

export default Ball;
