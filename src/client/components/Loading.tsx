import React from "react";
import { useSpring, config } from "react-spring";
import { AnimatedWrapper, Img, PageHolder } from "../styles";

const Loading = (props: any) => {
    const spin = useSpring({
        from: {
            rotateZ: 180,
            opacity: 0.9,
        },
        to: {
            rotateZ: 0,
            opacity: 1,
        },
        loop: true,
        config: config.molasses,
    });

    return (
        <PageHolder center={true}>
            <AnimatedWrapper style={spin}>
                <Img src="/assets/img/bucketsLogo.png" />
            </AnimatedWrapper>
        </PageHolder>
    );
};

export default Loading;
