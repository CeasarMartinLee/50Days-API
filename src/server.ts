import "reflect-metadata"
require('dotenv').config()
import { createExpressServer, Action } from 'routing-controllers'
import dbSetup from './db'
import GameController from "./game/controller";
import PlayerController from './players/controller'
import QuestionController from './question/controller'


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



dbSetup().then(() => {
    const server = app.listen(app.get("port"), () => {
        console.log(
            "App is running on http://localhost:%d in %s mode",
            app.get("port"),
            app.get("env")
        )
    })

    let socket = require('socket.io');
    let io = socket(server);

    io.on('connection', (socket:any) => {
        console.log(socket.id);

        socket.on('SEND_MESSAGE', function(data:any){
            console.log('IM HERE')
            io.emit('RECEIVE_MESSAGE', data);
        })
    });

    

}).catch((err) => console.error(err))