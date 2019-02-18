import { BaseEntity } from 'typeorm/repository/BaseEntity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { MinLength } from 'class-validator';
import Game from '../game/entity';

@Entity()
export default class Score extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false })
  @MinLength(3)
  username: string

  @Column({ default: 0, nullable: false })
  currentScore: number

  @Column({ default: false , nullable: false})
  isEliminated: boolean

  @Column({ nullable: false, default: 0})
  totalTimeStamp: number

  @ManyToOne(type => Game, game => game.id)
  game: Game

}