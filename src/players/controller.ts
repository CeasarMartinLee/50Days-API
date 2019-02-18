import { JsonController, Post, Body, Get, BadRequestError } from 'routing-controllers'
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



@JsonController()
export default class PlayerController{
  @Post('/game/join')
  async joinGame(@Body() player:PlayerJoin ) {
    // Check if the game is available
    const game = await Game.findOne({code: player.gameCode})

    if(!game && game.status !== 'Pending') {
      throw new BadRequestError()
    }
    
    const score = new Score()
    score.game = game
    score.username = player.username
    await score.save()

    return { user: score.id }
  }

  @Get('/')
  async getPlayer() {
    return { success: 'Yes'}
  }
}




