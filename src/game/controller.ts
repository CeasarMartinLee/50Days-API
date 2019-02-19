import { JsonController, Body, Post, Get, Param } from 'routing-controllers'
import Game from './entity'
import Score from '../score/entity';


@JsonController()
export default class GameController {

    @Post("/game")
    async createGame() {
        const game = new Game()
        game.status = "Pending"
        game.level = 1
        game.code = Math.floor(1000 + Math.random() * 9000)
        console.log(game)
        return await game.save()
    }

    @Get('/game/:id/players')
    async getPlayers(@Param('id') id: number) {

        
        const players = await Score.find({ where: { gameId: id }})
        return players
    }

    @Get("/game/:id")
    Game(
        @Param('id') id: number
    ) {
        return Game.findOne(id)
    }

}