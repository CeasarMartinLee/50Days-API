import { JsonController, Post, Body, Get } from 'routing-controllers'
import {IsString, IsNotEmpty, MinLength, Max, Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from "class-validator";
import Player from './entity'

@ValidatorConstraint({ name: "gameId", async: false })
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
  gameId: number
}



@JsonController()
export default class PlayerController{
  @Post('/players')
  async joinGame(@Body() player:PlayerJoin ) {
    // Check if the game is available
    // Not => Send bad request
    // Yes => Add player to db / Create a Score
    // Add player to db
    // Add player to score
  }

  @Get('/')
  async getPlayer() {
    return { success: 'Yes'}
  }
}




