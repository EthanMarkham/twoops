import { Triplet, useBox, usePlane, useTrimesh } from "@react-three/cannon";
import { useEffect, useMemo, useState } from "react";
import useStore from "../store";

const offsetTriplet: (current: Triplet, offset: Triplet) => Triplet = (
    current,
    offset = [0, 0, 0]
) => [offset[0] + current[0], offset[1] + current[1], offset[2] + current[2]];

interface HitBoxPositions {
    top: Triplet;
    bottom: Triplet;
    main: Triplet;
}

interface Results {
    success: boolean;
    isAirball: boolean;
}

const useHoopHitboxes = (nodes: any): [Results, () => void] => {
    const [topHit, setTopHit] = useState<number>(0);
    const [bottomHit, setBottomHit] = useState<number>(0);
    const [hitHoop, setHitHoop] = useState<boolean>(false);
    const hoopPosition = useStore((state) => state.roundInfo.hoopLocation);

    const hitbox: HitBoxPositions = useMemo<HitBoxPositions>(
        () => ({
            top: offsetTriplet(
                [
                    nodes.BasketTrigger_1.position.x,
                    nodes.BasketTrigger_1.position.y,
                    nodes.BasketTrigger_1.position.z,
                ],
                hoopPosition
            ),
            bottom: offsetTriplet(
                [
                    nodes.BasketTrigger_2.position.x,
                    nodes.BasketTrigger_2.position.y,
                    nodes.BasketTrigger_2.position.z,
                ],
                hoopPosition
            ),
            main: offsetTriplet(
                [
                    nodes.HitBox.position.x,
                    nodes.HitBox.position.y,
                    nodes.HitBox.position.z,
                ],
                hoopPosition
            ),
        }),
        [hoopPosition, nodes]
    );

    const resetHits = () => {
        setTopHit(0);
        setBottomHit(0);
        setHitHoop(false);
    };

    const results = useMemo(
        (): {
            success: boolean;
            isAirball: boolean;
        } => ({
            success: !!(topHit !== 0 && bottomHit !== 0 && topHit < bottomHit),
            isAirball: !hitHoop,
        }),
        [topHit, bottomHit, hitHoop]
    );

    const [, hoopAPI] = useTrimesh(() => ({
        type: "Static",
        position: hitbox.main,
        mass: 1,
        onCollide: () => setHitHoop(true),
        args: [
            nodes.HitBox.geometry!.attributes!.position!.array ||
                ([0, 0, 0] as ArrayLike<number>),
            nodes.HitBox.geometry!.index!.array ||
                ([0, 0, 0] as ArrayLike<number>),
        ],
        material: { friction: 1, restitution: 0.2 },
        allowSleep: false,
    }));

    //top hit collision tracker
    const [, topBucketAPI] = useTrimesh(() => ({
        type: "Static",
        position: hitbox.top,
        collisionResponse: 0,
        onCollide: () => setTopHit(new Date().getTime()),
        args: [
            nodes.BasketTrigger_1!.geometry!.attributes!.position!.array ||
                ([0, 0, 0] as ArrayLike<number>),
            nodes.BasketTrigger_1!.geometry!.index!.array ||
                ([0, 0, 0] as ArrayLike<number>),
        ],
        allowSleep: false,
    }));

    //bottom hit collision tracker
    const [, bottomBucketAPI] = useTrimesh(() => ({
        type: "Static",
        position: offsetTriplet(hitbox.bottom, [0, -2, 0]),
        collisionResponse: 0,
        onCollide: () => setBottomHit(new Date().getTime()),
        args: [
            nodes.BasketTrigger_2!.geometry!.attributes!.position!.array ||
                ([0, 0, 0] as ArrayLike<number>),
            nodes.BasketTrigger_2!.geometry!.index!.array ||
                ([0, 0, 0] as ArrayLike<number>),
        ],
        allowSleep: false,
    }));

    useEffect(() => {
        hoopAPI.position.set(...hitbox.main);
        topBucketAPI.position.set(...offsetTriplet(hitbox.top, [0, 3, -0]));
        bottomBucketAPI.position.set(
            ...offsetTriplet(hitbox.bottom, [0, -2, -0])
        );
    }, [hitbox]);

    return [results, resetHits];
};

export default useHoopHitboxes;
