# twoops
Twitch Basket-Ball Shooter

## What the project does:

Twoops is a web app that can be used as a Twitch Overlay.  When you log-in via twitch, a bot will join your channel and listen to chat for a command to launch the game. 

Type "!shot x: [1-100] y: [1-100], z: [1-100]), with x, y, z representing the velocity on the throw, and the ball will be launched on the client's web page.


## Why the project is useful:

Twoops adds viewer engagment to your stream.

How users can get started with the project:

## To run locally:

  1. Create a .ENV file with  the following variables:
  
        ```BOT_USERNAME=
        BOT_ID=
        BOT_PASSWORD=
        BOT_SECRET=
        SERVER_URL=http://localhost:[PORT]
        SESSION_SECRET=

        DB_CONN_STRING=
        DB_NAME=
        SETTINGS_COLLECTION_NAME=
        ROUND_COLLECTION_NAME=
        PORT=
        ```
        
  2. Obtain a bot username, bot id, and bot secret by setting up and registering a bot at https://dev.twitch.tv/docs/authentication/#registration
  
  3. At the [twitch bot console](https://dev.twitch.tv/console/apps) set the oauth URL to `http://localhost:[PORT]/auth/twitch/callback`
  
  4. Copy your bot user-name, client ID, and generate a new secret for your .ENV file 

  5. Obtain an O:Auth token for your bot at [Twitch Chat OAuth Password Generator](https://twitchapps.com/tmi/) and paste it into the BOT_SECRET field
  
  6. Set the DB_CONN_STRING to your mongoDB connection. For example: `mongodb+srv://user:password@instance.8fe3.mongodb.net`
  
  7. Set the DB, Settinsg Collection, and round collection variables as you see fit.
  
  8. Run `yarn start` or `npm start`
  
  
## Where users can get help with your project:

I am always looking for better methods, organization and nearly anything. I am an entry level developer and appreciate any feedback what-so-ever! 

Create a UI for users to be able set custom settings, chat messages, colors, timers, hoop spawn locations, and ect. The backend infrastructure is there and need to code a front end.

Implement a system to mark games not inprogress either via a button on screen or over a timer. Often times shots get missed which bugs out the game as it thinks you are still in an active round.

Create a new ball texture map.

Ideas for a better shooting mechanic system.

Sound effects.

## Known Bugs:

React Three Fibre disables the canvas while not focused. If the game is minimized, it will wait til you focus on it to run the shot. Looking for further info on the frame loops [here](https://docs.pmnd.rs/react-three-fiber/API/canvas)

The basket detection system is buggy and needs to be redone. Currently I have to hitbox's (one above and one slighty below the rim), and if the ball hits both of them in the correct sequency I mark it as success.

## Who maintains and contributes to the project:

Ethan Markham. Reach out to me on discord at t00much#8965

