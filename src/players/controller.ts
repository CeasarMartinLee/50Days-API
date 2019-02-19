import { JsonController, Post, Body, Get, BadRequestError, NotFoundError } from 'routing-controllers'
import {IsString, IsNotEmpty, MinLength, Max, Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from "class-validator";
import Player from './entity'
import Game from '../game/entity'
import Score from '../score/entity'

@ValidatorConstraint({ name: "game code", async: false })
export class GameIdLength implements ValidatorConstraintInterface {
 
    validate(id: number, args: ValidationArguments) {
      return String(id).split('').length === 4
    }
 
    defaultMessage(args: ValidationArguments) { // here you can provide default error message if validation failed
        return "The Game id must contain 4 characters";
    }
}

export class PlayerJoin {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string

  @Max(9999)
  @Validate(GameIdLength)
  gameCode: number
}

export class AuthPlayerInput {
  @IsNotEmpty()
  playerId: string

  @IsNotEmpty()
  gameId: string
}



@JsonController()
export default class PlayerController{
  @Post('/game/join')
  async joinGame(@Body() player:PlayerJoin ) {

    const game = await Game.findOne({code: player.gameCode})

    if(game && game.status === 'Pending') {
      const score = new Score()
      score.game = game
      score.username = player.username
      await score.save()

      return { player: score, game: game }

    } else {
      throw new BadRequestError()
    }
    
  }

  @Post('/player/authenticate')
  async authPlayer(@Body() auth:AuthPlayerInput) {
    const score = await Score.findOne({ id: auth.playerId, game: auth.gameId }, { relations: ["game"]})

    console.log(score, '<== SCORE')

    if(!score) {
      console.log('BAD REQUEST')
      throw new BadRequestError()
    }

    const game = await Game.findOne(score.game)

    // if(sco === 'Finished') {
    //   throw new NotFoundError()
    // }

    return {score, game}
  }

  @Get('/')
  async getPlayer() {
    return { success: 'Yes'}
  }
}




