import "reflect-metadata"
require('dotenv').config()
import { createExpressServer, Action } from 'routing-controllers'
import {Server} from 'http'
import dbSetup from './db'
import GameController from "./game/controller";
import PlayerController from './players/controller'
import QuestionController from './question/controller'
import Game from './game/entity'
import ActiveQuestion from "./activequestions/entity";
import Question from "./question/entity";
import Guesses from "./guesses/entity"
import Score from './score/entity'


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


const getCurrentQuestion = async (gameId:number) => {
    const activeQuestions = await ActiveQuestion.find({where: { game: gameId, isDisplayed: false }})
    const currentQuestion = await Question.findOne({where: {id: activeQuestions[0].questionId}, relations: ["answer"]})
    currentQuestion.answer = currentQuestion.answer
        .map((a) => ({ sort: Math.random(), value: a }))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value)
    return {currentQuestion, activeId: activeQuestions[0].id}
}
dbSetup().then(() => {
    server.listen(app.get("port"), () => {
        console.log(
            "App is running on http://localhost:%d in %s mode",
            app.get("port"),
            app.get("env")
        )
    })

    
    io.on('connection', (socket:any) => {

        socket.on('CHANGE_GAME_STATUS', async function(data:any){
            const game = await Game.findOne(data.gameId)
            game.status = data.status

            if(data.status === 'Started') {
                const gamePlayers = await Score.find({where: {game: game}})
                
                if(gamePlayers.length <= 2) {
                    game.maxRounds = 1
                } else if(gamePlayers.length <= 6) {
                    game.maxRounds = 2
                } else {
                    game.maxRounds = 3
                }
            }

            await game.save()
            io.emit(`GAME_STATUS_CHANGED_${game.id}`, {status: game.status})
        })

        socket.on('GET_CURRENT_QUESTION', async function(data:any){
            const {currentQuestion, activeId } = await getCurrentQuestion(data.gameId)
            io.emit(`CURRENT_QUESTION_${data.gameId}`, {id: currentQuestion.id, question: currentQuestion.question, answer: currentQuestion.answer, activeId});
        })

        socket.on('NEXT_QUESTION', async (data:any) => {
            const { activeQuestionId, gameId } = data
            const activeQuestion = await ActiveQuestion.findOneOrFail(activeQuestionId)
            activeQuestion.isDisplayed = true
            await activeQuestion.save()

            const DisplayedQuestion = await ActiveQuestion.find({where: {game: gameId, isDisplayed: true }})
            
            if(DisplayedQuestion.length % 5 === 0) {
                // Level Up
                const game = await Game.findOne(gameId)
                game.level = Number(game.level + 1)
                await game.save()

                
                // Next step: Eliminate player
                switch(game.maxRounds) {
                    case 1: 
                        game.status = 'Finished'
                        const winner = await Score.find({where: {game}, order: {currentScore: 'DESC', totalTimeStamp: 'ASC'}, take: 1})
                        io.emit(`WINNER_${game.id}`, { winner: winner[0] })
                    default:
                        switch(game.level) {
                            case 1:
                                game.level = Number(game.level + 1)
                                const playerList = await Score.find({where: {game}, order: {currentScore: 'DESC', totalTimeStamp: 'ASC'}, skip: 2})
                                
                                playerList.forEach(async player => {
                                    player.isEliminated = true
                                    await player.save()
                                })

                                game.level = Number(game.level + 1)
                                await game.save()

                                io.emit(`GAME_LEVEL_UP_${gameId}`, game.level)
                                io.emit(`DISCONNECT_PLAYER_${game.id}`, { players: playerList })
                            case 2:
                                const winner = await Score.find({where: {game, isEliminated: false}, order: {currentScore: 'DESC', totalTimeStamp: 'ASC'}, take: 1})
                                io.emit(`WINNER_${game.id}`, { winner: winner[0] })
                        }

                        // const playerList = Score.find({where: {game}, order: {currentScore: 'DESC', totalTimeStamp: 'ASC'}, skip: 2})
                }

                // const playerList = Score.find({where: {game}, order: {currentScore: 'DESC', totalTimeStamp: 'ASC'}, skip: 2})
            }

            const {currentQuestion, activeId } = await getCurrentQuestion(gameId)
            io.emit(`CURRENT_QUESTION_${gameId}`, {id: currentQuestion.id, question: currentQuestion.question, answer: currentQuestion.answer, activeId});
        })

        socket.on('SUBMIT_PLAYER_ANSWER', async (data:any) => {
            const { 
                activeQuestionId, 
                playerId, 
                isCorrect, 
                timestamp, 
                gameId 
            } = data

            const correctGuesses = await Guesses.find({where: { activeQuestionId, isCorrect: true }})
            console.log(correctGuesses.length, '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
            const newGuess = new Guesses()
            newGuess.gameId = gameId
            newGuess.playerId = playerId
            newGuess.isCorrect = isCorrect
            newGuess.timestamp = parseInt(timestamp)
            newGuess.activeQuestionId = activeQuestionId
            await newGuess.save()
        
            const score = await Score.findOne(playerId)

            if(isCorrect) {
                if(correctGuesses.length < 1) {
                    score.currentScore = score.currentScore + 300
                } else if(correctGuesses.length < 10) {
                    score.currentScore = score.currentScore + 200
                } else {
                    score.currentScore = score.currentScore + 100
                }
            }

            score.totalTimeStamp = Number(score.totalTimeStamp) + timestamp
            await score.save() 
            
            if(isCorrect) {              
                io.emit(`PLAYER_STAT_UPDATE_${gameId}`, { playerId, score: score.currentScore })
            }
        })
    });

    

}).catch((err) => console.error(err))