import { GameManager, RoundResponse, SettingsResponse, ShotResult } from "../modules/gameManager/types";
import { TwitchBot } from "../modules/twitchBot";

require('dotenv').config();

const express = require('express');
const router = express.Router();
const gameManager: GameManager = require('../modules/gameManager');
const twitchBot: TwitchBot = require('../modules/twitchBot');

//routes
router.get("/init", verifyUser, async (req: any, res: any) => {

    twitchBot.joinChannel(req.session.passport.user.data[0].login); //join twitch chat for user

    gameManager.getSettings(req.session.passport.user.data[0].login)
        .then((settingsResponse: SettingsResponse) => {
            return res.json({
                newSettings: settingsResponse.new,
                ballsSpawn: settingsResponse.settings.ballSpawn,
                alphaChannel: settingsResponse.settings.alphaChannel,
                channel: settingsResponse.settings.channel,
                hoopSpawn: settingsResponse.settings.hoopsSpawn,
                resetTime: settingsResponse.settings.resetTime
            })
        })
});

router.post("/logShot", verifyUser, async (req: any, res: any) => {
    let shotResult: ShotResult = req.body;
    gameManager.logResult(req.body.channel, shotResult)
   console.log('logging shot result', req.body.channel, shotResult)
    return res.json({ error: false });

});



function verifyUser(req: any, res: any, next: any) {
    if (!req.session && !req.session.passport && !req.session.passport.user && !req.session.passport.user.data[0] && !req.session.passport.user.data[0].login) {
        return res.json({ error: true, message: "Error! Lost user session data? Refresh page." });
    }
    else next();
}


module.exports = router;