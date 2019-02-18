import "reflect-metadata"
require('dotenv').config()
import { createExpressServer, Action } from 'routing-controllers'
import dbSetup from './db'
import GameController from "./game/controller";
import PlayerController from './players/controller'


const app = createExpressServer({
    controllers: [
        GameController,
        PlayerController
    ],
    authorizationChecker: async (action: Action) => {
        return false
    },
    currentUserChecker: async (action: Action) => {
        return undefined
    },
    cors:  true
    
})
app.set("port", process.env.PORT || 3000)

let http = require('http').Server(app)
let io = require('socket.io')(http)


io.on('connection', function(socket: any){
    console.log('a user connected');
});


dbSetup().then(() => {
    app.listen(app.get("port"), () => {
        console.log(
            "App is running on http://localhost:%d in %s mode",
            app.get("port"),
            app.get("env")
        )
    });
}).catch((err) => console.error(err))