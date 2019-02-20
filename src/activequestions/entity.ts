import { Entity, PrimaryGeneratedColumn, Column, ManyToOne  } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import Game from '../game/entity'
import Question from '../question/entity'

import { IsString, IsBoolean } from 'class-validator';

@Entity()
export default class ActiveQuestion extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @IsBoolean()
  @Column('boolean', {nullable:false, default: false})
  isDisplayed: boolean

  @Column('integer', {nullable: false})
  questionId: number

  @ManyToOne(type => Game)
  game: Game


}