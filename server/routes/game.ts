import { TwitchBot } from "../modules/twitchBot";
import { GameManager, ShotResult } from "../types/game";

require('dotenv').config();

const express = require('express');
const router = express.Router();
const gameManager: GameManager = require('../modules/game');
const twitchBot: TwitchBot = require('../modules/twitchBot');

//routes
router.get("/init", verifyUser, async (req: any, res: any) => {

    twitchBot.joinChannel(req.session.passport.user.data[0].login); //join twitch chat for user

    gameManager.getAggregatedData(req.session.passport.user.data[0].login)
        .then(({ settings, roundInfo, newData }) => {
            return res.json({
                newSettings: newData,
                ballsSpawn: settings.ballSpawn,
                alphaChannel: settings.alphaChannel,
                channel: settings.channel,
                hoopLocation: roundInfo.hoopLocation,
                attempts: roundInfo.shots.length,
                roundID: roundInfo._id,
            })
        })
});

router.post("/logShot", verifyUser, async (req: any, res: any) => {
    let shotResult: ShotResult = req.body;
    gameManager.logResult(req.session.passport.user.data[0].login, shotResult)
    .then(response => {
        return res.json(response);
    })
});

function verifyUser(req: any, res: any, next: any) {
    if (!req.session && !req.session.passport && !req.session.passport.user && !req.session.passport.user.data[0] && !req.session.passport.user.data[0].login) {
        return res.json({ error: true, message: "Error! Lost user session data? Refresh page." });
    }
    else next();
}


module.exports = router;