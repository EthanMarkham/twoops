import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { Triplet, useTrimesh } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import useStore from '../store';

type GLTFResult = GLTF & {
    nodes: {
        Plane: THREE.Mesh
        Plane_1: THREE.Mesh
        Plane_2: THREE.Mesh
        Plane_3: THREE.Mesh
        HitBox: THREE.Mesh
        BasketTrigger_1: THREE.Mesh
        BasketTrigger_2: THREE.Mesh
    }
    materials: {
        ['Material.003']: THREE.MeshStandardMaterial
        Material: THREE.MeshStandardMaterial
        ['Material.004']: THREE.MeshStandardMaterial
    }
}

interface HitBoxPositions {
    top: Triplet,
    bottom: Triplet,
    main: Triplet,
}

const offsetTriplet: (current: Triplet, offset: Triplet) => Triplet = (current, offset = [0, 0, 0]) => ([
    offset[0] + current[0],
    offset[1] + current[1],
    offset[2] + current[2]
]);

export default function Hoop(_props: any) {
    const { nodes, materials } = useGLTF("/assets/models/hoopModel.glb") as GLTFResult;

    const [isResponding, setRespondingStatus] = useState<boolean>(false);
    const resultsRequested: boolean = useStore(state => state.roundInfo.results.requested);
    const hoopPosition = useStore(state => state.roundInfo.hoopLocation);
    const setResults = useStore(state => state.setResults);

    const [topHit, setTopHit] = useState<number>(0);
    const [bottomHit, setBottomHit] = useState<number>(0);
    const [hitHoop, setHitHoop] = useState<boolean>(false);

    const results = useMemo(() => ({
        success: !!(topHit !== 0 && bottomHit !== 0 && topHit < bottomHit),
        isAirball: !hitHoop,
    }), [topHit, bottomHit, hitHoop]);

    //do i need to promise to ensure it runs in order?
    //push results up state when requested. is there better pattern for this?
    useEffect(() => {
        if (resultsRequested && !isResponding) {
            setRespondingStatus(true);
            setResults(results, () => {
                setTopHit(0);
                setBottomHit(0);
                setRespondingStatus(false);
                setHitHoop(false);
            });
        }
    }, [resultsRequested, results, isResponding]);

    //memotize hitbox positions to move whenever hoop does. Again probably way stuff I could do.
    const hitbox: HitBoxPositions = useMemo<HitBoxPositions>(() => ({
        top: offsetTriplet([nodes.BasketTrigger_1.position.x, nodes.BasketTrigger_1.position.y, nodes.BasketTrigger_1.position.z], hoopPosition),
        bottom: offsetTriplet([nodes.BasketTrigger_2.position.x, nodes.BasketTrigger_2.position.y, nodes.BasketTrigger_2.position.z], hoopPosition),
        main: offsetTriplet([nodes.HitBox.position.x, nodes.HitBox.position.y, nodes.HitBox.position.z], hoopPosition),
    }), [hoopPosition, nodes]);

    //I THINK I AM ABLE SUPPOSED TO GROUP THESE INTO COMPLEX SHAPE??? 

    //collison box for hoop
    const [, hoopAPI] = useTrimesh(() => ({
        type: "Static",
        position: hitbox.main,
        mass: 1,
        onCollide: () => setHitHoop(true),
        args: [
            nodes.HitBox.geometry!.attributes!.position!.array || [0, 0, 0] as ArrayLike<number>,
            nodes.HitBox.geometry!.index!.array || [0, 0, 0] as ArrayLike<number>
        ],
        material: { friction: 1, restitution: 0.2 },
    }));

    //top hit collision tracker
    const [, topBucketAPI] = useTrimesh(() => ({
        type: "Static",
        position: hitbox.top,
        collisionResponse: 0,
        onCollide: () => setTopHit(new Date().getTime()),
        args: [
            nodes.BasketTrigger_1!.geometry!.attributes!.position!.array || [0, 0, 0] as ArrayLike<number>,
            nodes.BasketTrigger_1!.geometry!.index!.array || [0, 0, 0] as ArrayLike<number>
        ],
    }));

    //bottom hit collision tracker
    const [, bottomBucketAPI] = useTrimesh(() => ({
        type: "Static",
        position: offsetTriplet(hitbox.bottom, [0, -2, 0]),
        collisionResponse: 0,
        onCollide: () => setBottomHit(new Date().getTime()),
        args: [
            nodes.BasketTrigger_2!.geometry!.attributes!.position!.array || [0, 0, 0] as ArrayLike<number>,
            nodes.BasketTrigger_2!.geometry!.index!.array || [0, 0, 0] as ArrayLike<number>
        ]
    }));

    //SET NEW HITBOX POSITIONS WITH API WHEN HOOP MOVES
    useEffect(() => {
        hoopAPI.position.set(...hitbox.main);
        topBucketAPI.position.set(...offsetTriplet(hitbox.top, [0, 3, -0]));
        bottomBucketAPI.position.set(...offsetTriplet(hitbox.bottom, [0, -2, -0]));
    }, [hitbox]);

    return (
        <group position={hoopPosition}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Plane.geometry}
                material={materials['Material.003']}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Plane_1.geometry}
                material={materials.Material}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Plane_2.geometry}
                material={nodes.Plane_2.material}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Plane_3.geometry}
                material={nodes.Plane_3.material}
            />
        </group>
    )
}
/* HIT BOX MESH FOR DEBUG


                        <mesh
                castShadow
                receiveShadow
                geometry={nodes.BasketTrigger_1.geometry}
                material={nodes.BasketTrigger_1.material}
                position={[0, 4, -2.15]}
                scale={[1.65, 1.65, 1.65]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.BasketTrigger_2.geometry}
                material={nodes.BasketTrigger_2.material}
                position={[0, 1.99, -2.15]}
                scale={[1.65, 1.65, 1.65]}
            />

            
            <mesh
                ref={ref}
                castShadow
                receiveShadow
                geometry={nodes.HitBox.geometry}
                material={nodes.HitBox.material}
            />
            */

useGLTF.preload("/assets/models/hoopModel.glb")