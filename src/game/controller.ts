import { JsonController, Body, Post, Get, Param } from 'routing-controllers'
import Game from './entity'
import Score from '../score/entity';
import ActiveQuestion from '../activequestions/entity'


@JsonController()
export default class GameController {

    @Post("/game")
    async createGame() {
        const game = new Game()
        game.status = "Pending"
        game.level = 1
        game.code = Math.floor(1000 + Math.random() * 9000)
        await game.save()

        console.log(game, ' POST CREATEGAME')

        let activeQuestions = new ActiveQuestion()
        for (let i=0; i <= 30; i++) {
            activeQuestions.game = game
            activeQuestions.questionId = await Math.floor(1 + Math.random() * 100)
            activeQuestions.save()
        }


        return game 
    }

    @Get('/game/:id/players')
    async getPlayers(@Param('id') id: number) {
        const players = await Score.find({ where: {game: id}})
        return players
    }

    @Get("/game/:id")
    Game(
        @Param('id') id: number
    ) {
        return Game.findOne(id)
    }

}