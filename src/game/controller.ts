import { JsonController, Body, Post, Get, Param } from 'routing-controllers'
import Game from './entity'


@JsonController()
export default class GameController {

    @Post("/game")
    createGame(@Body() game: Game) {
        game.status = "Pending"
        game.level = 1
        game.code = Math.floor(1000 + Math.random() * 9000)
        console.log(game)
        return game.save()
    }

    @Get("/game/:id")
    Game(
        @Param('id') id: number
    ) {
        return Game.findOne(id)
    }

}