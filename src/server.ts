import "reflect-metadata"
require('dotenv').config()
import { createExpressServer, Action } from 'routing-controllers'
import {Server} from 'http'
import dbSetup from './db'
import GameController from "./game/controller";
import PlayerController from './players/controller'
import QuestionController from './question/controller'
import Game from './game/entity'


const app = createExpressServer({
    controllers: [
        GameController,
        PlayerController,
        QuestionController
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

let server = new Server(app)
let socket = require('socket.io');
export let io = socket(server);


dbSetup().then(() => {
    server.listen(app.get("port"), () => {
        console.log(
            "App is running on http://localhost:%d in %s mode",
            app.get("port"),
            app.get("env")
        )
    })

    
    // export const io = IO(server)
    io.on('connection', (socket:any) => {
        console.log(socket.id);

        socket.on('CHANGE_QUESTION', function(data:any){
            console.log('IM HERE', data)
            io.emit('QUESTION_CHANGED', data);
        })

        socket.on('CHANGE_GAME_STATUS', async function(data:any){
            const game = await Game.findOne(data.gameId)
            game.status = data.status
            await game.save
            io.emit(`GAME_STATUS_CHANGED_${game.id}`, {status: game.status});

        })
    });

    

}).catch((err) => console.error(err))