import React, { useMemo, useState, useEffect } from 'react';
import { useTransition, config } from 'react-spring';
import useStore from '../store';


const GameMessages = (props: any) => {
    const user = useStore(state => state.roundInfo.shot.user);


    return (
        <div>

        </div>
    )
}

export default GameMessages;