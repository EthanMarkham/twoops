import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { Triplet, useTrimesh } from '@react-three/cannon';
import useStore from '../../../store';
import { useFrame, Vector3 } from '@react-three/fiber';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { getRandomPosition, Boundries } from '../../../utils/getRandomHoopPosition';

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

const offsetTriplet: (current: Triplet, offset: Triplet) => Triplet = (current, offset = [0, 0, 0]) => ([
    offset[0] + current[0],
    offset[1] + current[1],
    offset[2] + current[2]
]);

interface HitBoxPositions {
    top: Triplet,
    bottom: Triplet,
    main: Triplet,
}

export default function Hoop(_props: any) {
    const { nodes, materials } = useGLTF("/assets/models/hoopModel.glb") as GLTFResult;
    const hoopBoundries: Boundries = useStore(state => state.settings.hoopSpawn);
    const roundOverTrigger: boolean = useStore(state => state.roundInfo.roundOverTrigger);
    const shouldMove: boolean = useStore(state => state.roundInfo.results.success);

    const setResults = useStore(state => state.setResults);

    const hoop = useRef();

    const [hoopPosition, setHoopPosition] = useState(getRandomPosition(hoopBoundries));
    const [isAirball, setAirball] = useState<boolean>(true);

    const [hitTop, setHitTop] = useState<boolean>(false);
    const [topHitTime, setHitTopHitTime] = useState<number>(0);

    const [hitBottom, setHitBottom] = useState<boolean>(false);
    const [bottomHitTime, setBottomHitTime] = useState<number>(0);

    //memotize hitbox positions
    const hitbox: HitBoxPositions = useMemo<HitBoxPositions>(() => ({
        top: offsetTriplet([nodes.BasketTrigger_1.position.x, nodes.BasketTrigger_1.position.y, nodes.BasketTrigger_1.position.z], hoopPosition),
        bottom: offsetTriplet([nodes.BasketTrigger_2.position.x, nodes.BasketTrigger_2.position.y, nodes.BasketTrigger_2.position.z], hoopPosition),
        main: offsetTriplet([nodes.HitBox.position.x, nodes.HitBox.position.y, nodes.HitBox.position.z], hoopPosition),
    }), [hoopPosition, nodes]);


    //collison box for hoop
    const [, hoopAPI] = useTrimesh(() => {
        let posArray = nodes.HitBox.geometry!.attributes!.position!.array || [0, 0, 0] as ArrayLike<number>
        let indexArray = nodes.HitBox.geometry!.index!.array || [0, 0, 0] as ArrayLike<number>
        return {
            type: "Static",
            position: hitbox.main,
            mass: 1,
            onCollide: () => setAirball(false),
            args: [posArray, indexArray],
            material: { friction: 1, restitution: 0.2 },
        }
    });

    //top hit collision tracker
    const [, topBucketAPI] = useTrimesh(() => {
        let posArray = nodes.BasketTrigger_1!.geometry!.attributes!.position!.array || [0, 0, 0] as ArrayLike<number>
        let indexArray = nodes.BasketTrigger_1!.geometry!.index!.array || [0, 0, 0] as ArrayLike<number>
        return {
            type: "Static",
            position: hitbox.top,
            collisionResponse: 0,
            onCollide: () => setHitTop(true),
            args: [posArray, indexArray],
        }
    });

    //bottom hit collision tracker
    const [, bottomBucketAPI] = useTrimesh(() => {
        let posArray = nodes.BasketTrigger_2!.geometry!.attributes!.position!.array || [0, 0, 0] as ArrayLike<number>
        let indexArray = nodes.BasketTrigger_2!.geometry!.index!.array || [0, 0, 0] as ArrayLike<number>
        return {
            type: "Static",
            position: offsetTriplet(hitbox.bottom, [0, -2, 0]),
            collisionResponse: 0,
            onCollide: () => setHitBottom(true),
            args: [posArray, indexArray]
        }
    });

    const trackHits = useCallback(time => {
        if (hitTop) {
            setBottomHitTime(time);
            setHitTop(false);
        }
        else if (hitBottom) {
            setHitTopHitTime(time);
            setHitBottom(false);
        }
    }, [hitTop, hitBottom]);

    useFrame(({ clock }) => trackHits(clock.elapsedTime));

    const moveHitBoxes = useCallback(() => {
        hoopAPI.position.set(...hitbox.main);
        topBucketAPI.position.set(...hitbox.top);
        bottomBucketAPI.position.set(...offsetTriplet(hitbox.bottom, [0, -2, -0]));
    }, [hitbox, hoopAPI.position.set, topBucketAPI.position.set, bottomBucketAPI.position.set])

    //move hoop if boundries change or new round
    useEffect(() => {
        if (roundOverTrigger && shouldMove)
        setHoopPosition(getRandomPosition(hoopBoundries));
    }, [hoopBoundries, roundOverTrigger, shouldMove]);

    useEffect(moveHitBoxes, [moveHitBoxes]);

    useEffect(() => {
        if (roundOverTrigger) {
            setResults({
                success: topHitTime !== 0 && bottomHitTime !== 0 && topHitTime < bottomHitTime,
                isAirball: isAirball
            });
        }
    }, [roundOverTrigger, topHitTime, bottomHitTime, isAirball])


    /*
       
    
        const [hitTop, setHitTop] = useState(false);
        const [hitBottom, setHitBottom] = useState(false);
        const [hitTime, setHitTime] = useState({ top: 0, bottom: 0 });
    
        const bucket = useMemo(() => hitTime.top !== 0 && hitTime.bottom !== 0 && hitTime.top < hitTime.bottom, [hitTime]);
    

    
        //bucket detection
        
    
        const registerHits = useCallback(time => {
            if (hitTop) {
                console.log('setting top hit to', time)
                setHitTime(cur => ({ ...cur, top: time }));
                setHitTop(false);
            }
            else if (hitBottom) {
                console.log('setting bottom hit to', time)
                setHitTime(cur => ({ ...cur, bottom: time }));
                setHitBottom(false);
            }
        }, [hitTop, hitBottom, setHitTime]);
    
        //airball detection
        //const setNotAirball = useCallback(() => isAirball && setAirball(false), [isAirball, setAirball])
    
        //move hitboxes with hoop
        useEffect(() => console.log(hoopPosition), [hoopPosition])
    
        useEffect(() => api.position.set(...hitboxPos), [hitboxPos, api.position]);
    
        useEffect(() => topBucketAPI.position.set(...topTrigger), [topTrigger, topBucketAPI.position]);
    
        useEffect(() => bottomBucketAPI.position.set(...offsetTriplet(lowerTrigger, [0, -2, -0])), [lowerTrigger, bottomBucketAPI.position]);
    
        //seEffect(() => { if (bucket) setResult(true) }, [bucket, setResult]);
    
    
        //check hit boxes on each frame
        useFrame(({ clock }) => registerHits(clock.elapsedTime));
    */

    return (
        <group ref={hoop} position={hoopPosition}>
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
/*


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