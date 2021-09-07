import { useSphere } from '@react-three/cannon';
import { useGLTF } from '@react-three/drei';
import React, { useEffect, useState } from 'react';
import useStore from '../../../store';
import { Mesh, MeshStandardMaterial } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';


type GLTFResult = GLTF & {
    nodes: {
        Sphere: Mesh
        Sphere_1: Mesh
        Sphere_2: Mesh
        Eyeball: Mesh
        Eyeliner: Mesh
        Pupil: Mesh
        Eyeball001: Mesh
        Eyeliner001: Mesh
        Pupil001: Mesh
        Curve: Mesh
        Curve003: Mesh
        Cylinder001: Mesh
        Curve014: Mesh
        Curve006: Mesh
        Curve015: Mesh
        Cube001: Mesh
    }
    materials: {
        Material: MeshStandardMaterial
        ['Material.003']: MeshStandardMaterial
        ['Material.004']: MeshStandardMaterial
        ['Material.005']: MeshStandardMaterial
        ['Material.011']: MeshStandardMaterial
        ['Material.008']: MeshStandardMaterial
        ['Material.006']: MeshStandardMaterial
    }
}

const Ball = (_props: any) => {
    const { nodes, materials } = useGLTF("/assets/models/ballModel.glb") as GLTFResult;
    const triggerNewRound = useStore(state => state.triggerNewRound);

    const settings = useStore(state => state.settings);
    const { user, throwValues } = useStore(state => state.roundInfo.shot);
    const roundID = useStore(state => state.roundInfo.id);

    const [inProgress, setInProgress] = useState<boolean>(false);
    const [newRoundTriggered, setNewRoundTriggered] = useState<boolean>(false);

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
            if (pos[1] < 0 && !newRoundTriggered) {
                setNewRoundTriggered(true);
                triggerNewRound();
            }
        });
        return () => subscription();
    }, [newRoundTriggered, api])

    //reset ball when roundID changes
    useEffect(() => {
        setNewRoundTriggered(false);
        setInProgress(false);
        api.velocity.set(0, 0, 0);
        api.angularVelocity.set(0, 0, 0);
        api.position.set(settings.ballSpawn[0], settings.ballSpawn[1], settings.ballSpawn[2]);
    }, [roundID])

    return (
        <mesh
            ref={ref}
            dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Eyeball.geometry}
                material={materials['Material.005']}
                position={[0.3, 0.41, -0.89]}
                rotation={[0, 1.4, 0.25]}
                scale={[0.06, 0.34, 0.3]}>
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Eyeliner.geometry}
                    material={nodes.Eyeliner.material}
                    scale={[0.53, 1.14, 1.14]}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Pupil.geometry}
                    material={nodes.Pupil.material}
                    position={[0.56, -0.33, -0.16]}
                    rotation={[0.01, 0.07, -0.22]}
                    scale={[0.62, 0.69, 0.68]}
                />
            </mesh>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Eyeball001.geometry}
                material={materials['Material.008']}
                position={[-0.3, 0.41, -0.89]}
                rotation={[Math.PI, 1.4, -2.89]}
                scale={[0.06, 0.34, 0.3]}>
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Eyeliner001.geometry}
                    material={nodes.Eyeliner001.material}
                    scale={[0.53, 1.14, 1.14]}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Pupil001.geometry}
                    material={nodes.Pupil001.material}
                    position={[0.52, -0.33, -0.18]}
                    rotation={[0.02, 0.08, -0.22]}
                    scale={[0.62, 0.69, 0.68]}
                />
            </mesh>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Curve.geometry}
                material={nodes.Curve.material}
                position={[0.34, 0.89, -0.73]}
                rotation={[-1.31, -0.02, -0.08]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Curve003.geometry}
                material={nodes.Curve003.material}
                position={[-0.51, 0.96, -0.69]}
                rotation={[-1.31, 0.02, 0.08]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder001.geometry}
                material={nodes.Cylinder001.material}
                position={[0, -0.62, 0.66]}
                rotation={[-0.87, 0, 0]}
                scale={[-0.02, 0.04, -0.02]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Curve014.geometry}
                material={nodes.Curve014.material}
                position={[0.5, -0.04, -0.91]}
                rotation={[-1.6, -0.02, -0.52]}
                scale={[1.61, 0.43, 1.61]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Curve006.geometry}
                material={nodes.Curve006.material}
                position={[0.53, -0.87, 0.78]}
                rotation={[2.23, -0.05, -0.15]}
                scale={[1.67, 1.67, 1.67]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Curve015.geometry}
                material={nodes.Curve015.material}
                position={[0, 0, 0.97]}
                rotation={[1.53, -0.09, -0.2]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cube001.geometry}
                material={materials['Material.006']}
                position={[0.2, -0.6, -1.16]}
                rotation={[1.54, 0.67, -3.02]}
                scale={[-0.17, 0.03, 0.32]}
            />
            <group position={[0.03, 0, -0.04]} rotation={[-1.96, 0, -Math.PI / 2]}>
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Sphere.geometry}
                    material={nodes.Sphere.material}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Sphere_1.geometry}
                    material={materials['Material.003']}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Sphere_2.geometry}
                    material={nodes.Sphere_2.material}
                />
            </group>
        </mesh>
    )
}

useGLTF.preload("/assets/models/ballModel.glb")

export default Ball;