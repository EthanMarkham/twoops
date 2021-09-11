import { Triplet } from '@react-three/cannon';
import React, { Suspense, useEffect, useMemo } from 'react';
import useStore, { Page } from './store';
import { PageHolder } from './styles';
import GlobalFonts from './styles/fonts';

const BucketGame = React.lazy(() => import('./components/ThreeCanvas'));
const GameMessages = React.lazy(() => import('./components/GameMessages'));
const Loading = React.lazy(() => import('./components/Loading'));

interface GameDataResponse {
    newSettings: boolean,
    ballsSpawn: Triplet,
    alphaChannel: string,
    channel: string,
    hoopLocation: Triplet,
    attempts: number,
}

export const App: React.FC = () => {
    const page = useStore(state => state.pageIndex);
    const init = useStore(state => state.getGameData);

    //get data
    useEffect(init, [])
    
    const renderPage = (page: Page) => {
        switch (page) {
            case Page.LOADING:
                return (<Loading />)
            case Page.GAME:
                return (<PageHolder>
                    <BucketGame />
                    <GameMessages />
                </PageHolder>)
            default:
                throw new Error("No Page Index Set")
        }
    }

    return (
        <PageHolder>
            <GlobalFonts />
            <Suspense fallback={null}>
                {renderPage(page)}
            </Suspense>
        </PageHolder >
    );
}