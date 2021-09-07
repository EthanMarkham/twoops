import React, { Suspense, useEffect, useMemo } from 'react';
import useStore, { Page } from './store';
import { PageHolder } from './styles';
import GlobalFonts from './styles/fonts';

const ROUND_RESET_TIMER = 4000;

const BucketGame = React.lazy(() => import('./components/canvas'));
const Results = React.lazy(() => import('./components/results'));
const Loading = React.lazy(() => import('./components/loading'));

export const App: React.FC = () => {
    const page = useStore(state => state.pageIndex);

    const set = useStore(state => state.set);
    const setPage = useStore(state => state.setPage);
    const setError = useStore(state => state.setError);
    const newRound = useStore(state => state.newRound);

    const roundOverTrigger = useStore(state => state.roundInfo.roundOverTrigger);

    //get data
    useEffect(() => {
        fetch('/api/init')
            .then((data: any) => data.json())
            .then((data: any) => {
                console.log(data);
                if (data.newSettings) {
                    //start tutorial
                    console.log("caught new settings")
                }
                if (data.error) setError(new Error(data.message));
                else {
                    set(data);
                    setPage(Page.GAME);
                }
            })
    }, [])

    useEffect(() => { 
        roundOverTrigger && setTimeout(() => newRound(), ROUND_RESET_TIMER);
     }, [roundOverTrigger])

    const renderPage = (page: Page) => {
        switch (page) {
            case Page.LOADING:
                return (<Loading />)
            case Page.GAME:
                return (<PageHolder>
                    <BucketGame />
                    <Results />
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