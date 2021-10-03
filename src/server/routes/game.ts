import GameSetting from "../models/gameSettings";
import { TwitchBot } from "../modules/twitchBot";
import { GameManager, ShotResult } from "../types/game";
import { GameDAO } from "../types/mongo";

require("dotenv").config();

const express = require("express");
const router = express.Router();
const gameManager: GameManager = require("../modules/gameManager");
const twitchBot: TwitchBot = require("../modules/twitchBot");
const gameDAO: GameDAO = require("../dao/gameDAO");

//routes
router.get("/init", verifyUser, async (req: any, res: any) => {
    twitchBot.joinChannel(req.session.passport.user.data[0].login); //join twitch chat for user

    gameDAO
        .getUserData(req.session.passport.user.data[0].login)
        .then(({ settings, roundInfo, newData }) => {
            return res.json({
                newSettings: newData,
                settings: {
                    chat: settings.chat,
                    colors: settings.colors,
                },
                ballsSpawn: settings.ballSpawn,
                channel: settings.channel,
                hoopPosition: roundInfo.hoopLocation,
                attempts: roundInfo.shots.length,
                roundID: roundInfo._id,
            });
        });
});

router.post("/logShot/", verifyUser, async (req: any, res: any) => {
    let shotResult: ShotResult = req.body;
    console.log("logging shot for ", shotResult);
    gameManager
        .logResult(req.session.passport.user.data[0].login, shotResult)
        .then((response) => {
            return res.json(response);
        });
});

router.post("/updateSettings/", verifyUser, async (req: any, res: any) => {
    let newSettings: GameSetting = req.body;
    gameDAO.updateSettings(newSettings);
    return res.status(200).send('Updated');

});

function verifyUser(req: any, res: any, next: any) {
    if (
        !req.session &&
        !req.session.passport &&
        !req.session.passport.user &&
        !req.session.passport.user.data[0] &&
        !req.session.passport.user.data[0].login
    ) {
        return res.json({
            error: true,
            message: "Error! Lost user session data? Refresh page.",
        });
    } else next();
}

module.exports = router;
