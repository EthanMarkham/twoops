# twoops
Twitch Basket-Ball Shooter

## What the project does:

Twoops is a web app that can be used as a Twitch Overlay.  When you log-in via twitch, a bot will join your channel and listen to chat for a command to launch the game. 

Type "!shot x: [1-100] y: [1-100], z: [1-100]), with x, y, z representing the velocity on the throw, and the ball will be launched on the client's web page.


## Why the project is useful:

Twoops adds viewer engagment to your stream.

## To Run locally:

  1. Create a .ENV file with  the following variables:
  
        ```BOT_USERNAME=
        BOT_ID=
        BOT_PASSWORD=
        BOT_SECRET=
        BOT_TOKEN=
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

  5. Obtain an O:Auth token for your bot at [Twitch Chat OAuth Password Generator](https://twitchapps.com/tmi/) and paste it into the BOT_TOKEN field
  
  6. Set the DB_CONN_STRING to your mongoDB connection. For example: `mongodb+srv://user:password@instance.8fe3.mongodb.net`
  
  7. Set the DB_NAME, SETTINGS_COLLECTION_NAME, ROUND_COLLECTION_NAME, and PORT variables as you see fit. Make sure the port correctly matches the callback and port in the SERVER_URL variable.
  
  8. Run ```
  yarn build:server
  yar build:client
  yarn start```
  
  
## Where users can get help with your project:

I am always open to feedback and improvements!

Create a UI for users to be able set custom settings, chat messages, colors, timers, hoop spawn locations, and ect. The backend is mostly there.

Implement a system to mark games as not 'iPprogress', either via a button on screen or over a timer

Create a new ball texture map.

Ideas for better shooting mechanics.

Sound effects.

## Known Bugs:

React Three Fibre disables the canvas while not focused. If the game is minimized, it will wait til you focus back on the window to run the shot. Looking for further info on the frame loops [here](https://docs.pmnd.rs/react-three-fiber/API/canvas)

The basket detection system is buggy and needs to be redone. Currently I have two hitbox's (one above and one slighty below the rim), and if the ball hits both of them in the correct sequency I mark it as success.

Ball bounces a little when you first load page.

When I build the client, CopyPlugin overwrites the public folder while the same behavior does not happen when building the server. To fix I added another rule to copy the servers public folder after on the client build config. 

## Who maintains and contributes to the project:

Reach out to me on discord at t00much#8965

