import React, { useEffect, useMemo, useState, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import useStore from "../../store";
import { Color, MeshStandardMaterial, Mesh } from "three";
import useHoopHitboxes from "../../hooks/useHoopHitboxes";

type GLTFResult = GLTF & {
    nodes: {
        Plane: THREE.Mesh;
        Plane_1: THREE.Mesh;
        Plane_2: THREE.Mesh;
        Plane_3: THREE.Mesh;
        HitBox: THREE.Mesh;
        BasketTrigger_1: THREE.Mesh;
        BasketTrigger_2: THREE.Mesh;
    };
    materials: {
        ["Material.003"]: THREE.MeshStandardMaterial;
        Material: THREE.MeshStandardMaterial;
        ["Material.004"]: THREE.MeshStandardMaterial;
    };
};

export default function Hoop(_props: any) {

    const { nodes, materials } = useGLTF(
        "/assets/models/hoopModel.glb"
    ) as GLTFResult;

    useHoopHitboxes(nodes);

    const hoopPosition = useStore((state) => state.roundInfo.hoopPosition);
    const s = useStore((state) => state.roundInfo);

    const colors = useStore((state) => state.settings.colors);

    useEffect(() => console.log(s), [s])
    //backboard material
    const backboardMaterial = useMemo(
        (): MeshStandardMaterial =>
            new MeshStandardMaterial({ color: new Color(colors.backboard) }),
        [colors.backboard]
    );
    const backboard = useRef<Mesh>();
    useFrame(() => {
        if (backboard.current) {
            let m = backboard.current.material as MeshStandardMaterial;
            if (!m.color.equals(backboardMaterial.color)) {
                backboard.current.material = backboardMaterial;
                console.log("setting backboard mat");
            }
        }
    });

    return (
        <group position={hoopPosition}>
            <mesh ref={backboard} geometry={nodes.Plane.geometry} />
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
    );
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

useGLTF.preload("/assets/models/hoopModel.glb");
