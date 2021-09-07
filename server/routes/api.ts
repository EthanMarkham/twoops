import { GameManager } from "../modules/gameManager";
import { Game } from "../modules/gameManager/models/game";
import { ShotResult } from "../modules/gameManager/utils";
import { TwitchBot } from "../modules/twitchBot";

const express = require('express');
const router = express.Router();
//var bucketManager = require('../modules/twitchBot/buckets')

//routes
router.get("/init", async (req: any, res: any) => {
    const channel: string | undefined = req.session.passport.user.data[0].login;
    const gameManager: GameManager = require('../modules/gameManager');
    const twitchBot: TwitchBot = require('../modules/twitchBot');

    if (!channel) return res.json({ error: true, message: "Error fetching pregame data. Try refreshing. Oops!" });

    twitchBot.joinChannel(channel); //join twitch chat

    gameManager.addGame(channel) //get game
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
            return res.json({ error: true, message: "Error fetching pregame data. Try refreshing. Oops!" });
        })
});

router.post("/postShot", async (req: any, res: any) => {
    const channel: string | undefined = req.session.passport.user.data[0].login;
    const gameManager: GameManager = require('../modules/gameManager');

    if (!channel) return res.json({ error: true, message: "Error! Session Expired! Refresh Page!! (ps: it was a bucket)" });
    
    const shotResult: ShotResult = req.body;
    gameManager.logResult(channel, shotResult);

    return res.json({error: false});
});

module.exports = router;