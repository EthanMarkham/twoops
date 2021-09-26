import React, {useState, useEffect } from "react";
import { animated, SpringValue, useSpring } from "react-spring";
import useStore from '../store';
import {LogoContainer} from '../styles/settings'

const Animated = animated(LogoContainer);

interface Props {
}
function SvgComponent({ }: Props) {
    const [isShowing, setShowing] = useState<boolean>(false);
    const togglePanel = useStore((state) => state.toggleSettings);

    const [settingsLogoTransition, settingsLogoAPI] = useSpring(() => ({
        opacity: 1,
    }));

    useEffect(() => {
        settingsLogoAPI.start({opacity: isShowing ? 1 : 0})
        console.log('toggle icon', isShowing)
    }, [isShowing])

    return (
        <Animated
            style={settingsLogoTransition}
            width={20}
            height={20}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onMouseEnter={() => setShowing(true)}
            onMouseLeave={() => setShowing(false)}
            onClick={() => {
                setShowing(false);
                togglePanel();
            }}
        >
            <path
                d="M11.523 20h-3.64a1 1 0 01-.977-.786l-.407-1.884a8.002 8.002 0 01-1.535-.887l-1.837.585a1 1 0 01-1.17-.453L.133 13.424a1.006 1.006 0 01.193-1.239l1.425-1.3a8.1 8.1 0 010-1.772L.326 7.816a1.006 1.006 0 01-.193-1.24l1.82-3.153a1 1 0 011.17-.453l1.837.585c.244-.18.498-.348.76-.5.253-.142.513-.271.779-.386L6.907.787A1 1 0 017.883 0h3.64a1 1 0 01.976.787l.412 1.883a8.192 8.192 0 011.534.887l1.838-.585a1 1 0 011.17.453l1.82 3.153c.232.407.151.922-.194 1.239l-1.425 1.3a8.1 8.1 0 010 1.772l1.425 1.3c.345.318.425.832.194 1.239l-1.82 3.153a1 1 0 01-1.17.453l-1.838-.585a7.98 7.98 0 01-1.534.886l-.412 1.879a1 1 0 01-.976.786zM9.699 6a4 4 0 100 8 4 4 0 000-8z"
                fill="#000"
            />
        </Animated>
    );
}

export default SvgComponent;
