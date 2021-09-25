import { PerspectiveCamera } from "@react-three/drei";
import {
    extend,
    ReactThreeFiber,
    useFrame,
    useThree,
} from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { JsxEmit } from "typescript";
extend({ OrbitControls });

const CameraController = () => {
    const { camera, gl } = useThree();
    const [isInitialized, setInitialized] = useState<Boolean>(false);

    useEffect(() => {
        if (!isInitialized) {
            console.log('initializing camera position.')
            camera.position.set(0, 15, -20);
            camera.rotation.set(-Math.PI / 80, Math.PI, 0);
            setInitialized(true);
        }
    }, [isInitialized, camera]);

    /*
    useEffect(() => {
        const controls = new OrbitControls(camera, gl.domElement);


        controls.update();
        controls.minDistance = 3;
        controls.maxAzimuthAngle
        controls.maxDistance = 20;
        return () => {
            controls.dispose();
        };
    }, [camera, gl]);
    */
    return null;
};

export default CameraController;
