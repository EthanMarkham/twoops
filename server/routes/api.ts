import { GameManager } from "../modules/gameManager";
import { Game } from "../modules/gameManager/models/game";
import { ShotResult } from "../modules/gameManager/utils";
import { TwitchBot } from "../modules/twitchBot";

const express = require('express');
const router = express.Router();
//var bucketManager = require('../modules/twitchBot/buckets')

//routes
router.get("/init", async (req: any, res: any) => {
    if (req.session && req.session.passport && req.session.passport.user && req.session.passport.user.data[0] && req.session.passport.user.data[0].login) {
        const gameManager: GameManager = require('../modules/gameManager');
        const twitchBot: TwitchBot = require('../modules/twitchBot');

        twitchBot.joinChannel(req.session.passport.user.data[0].login); //join twitch chat

        gameManager.addGame(req.session.passport.user.data[0].login) //get game
            .then((game: Game) => {
                return res.json({
                    newSettings: game.newSettings,
                    ballsSpawn: game.settings.ballSpawn,
                    alphaChannel: game.settings.alphaChannel,
                    channel: game.settings.channel,
                    hoopSpawn: game.settings.hoopsSpawn,
                    resetTime: game.settings.resetTime
                })
            })
            .catch((error: Error) => {
                console.log("Error fetching pregame. ", error);
            })
    }
    else return res.json({ error: true, message: "Error! Lost user session data? Refresh page." });

});

router.post("/postShot", async (req: any, res: any) => {
    if (req.session && req.session.passport && req.session.passport.user && req.session.passport.user.data[0] && req.session.passport.user.data[0].login) {
        const gameManager: GameManager = require('../modules/gameManager');
        const shotResult: ShotResult = req.body;
        gameManager.logResult(req.session.passport.user.data[0].login, shotResult);
        return res.json({ error: false });
    }
    else return res.json({ error: true, message: "Error! Lost user session data? Refresh page." });
});

module.exports = router;