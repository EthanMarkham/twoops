import { useSphere } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import React, { useEffect, useState } from 'react';
import useStore from '../store';
import { Mesh, MeshStandardMaterial } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

type GLTFResult = GLTF & {
    nodes: {
        BasketballSeams: THREE.Mesh
        Basketball: THREE.Mesh
    }
    materials: {
        BasketballSeams: THREE.MeshStandardMaterial
        Basketball: THREE.MeshStandardMaterial
    }
}

const Ball = (props: any) => {
    const { nodes, materials } = useGLTF("/assets/models/ballLowPoly.glb") as GLTFResult;

    const [resultsRequested, setResultsRequested] = useState<boolean>(false);
    const [inProgress, setInProgress] = useState<boolean>(false);

    const settings = useStore(state => state.settings);
    const { user, throwValues } = useStore(state => state.roundInfo.shot);
    const { id, attempts } = useStore(state => state.roundInfo);
    const requestResults = useStore(state => state.requestResults);

    const [ref, api] = useSphere(() => ({
        mass: 1,
        position: settings.ballSpawn,
        rotation: [0, Math.PI / -5, 0],
        material: { friction: 1, restitution: 0.5 },
    }));

    useEffect(() => {
        if (!inProgress && user !== "" && throwValues[0] !== 0) {
            setInProgress(true);
            api.applyImpulse(throwValues, [0, 0, throwValues[2] / 45]);
        }
    }, [inProgress, throwValues, user]);

    useEffect(() => {
        const subscription = api.position.subscribe((pos) => {
            if (pos[1] < 0 && !resultsRequested && inProgress) {
                requestResults();
                setResultsRequested(true);
            }
        });
        return () => subscription();
    }, [resultsRequested, api, inProgress])

    //reset ball when roundID changes
    useEffect(() => {
        setTimeout(() => {
            setResultsRequested(false);
            setInProgress(false);
            api.velocity.set(0, 0, 0);
            api.angularVelocity.set(0, 0, 0);
            api.position.set(settings.ballSpawn[0], settings.ballSpawn[1], settings.ballSpawn[2]);
        }, 2000)
    }, [id, attempts])

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
    )
}

useGLTF.preload("/assets/models/ballLowPoly.glb")

export default Ball;