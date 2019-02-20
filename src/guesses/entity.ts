import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, CreateDateColumn  } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString } from 'class-validator';

@Entity()
export default class Guesses extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @IsString()
  @Column('text', {nullable:false})
  gameId: number

  @Column('int', {nullable: false})
  activeQuestionId: number

  @Column('text', {nullable: false})
  playerId: string

  @Column('boolean', { nullable: false})
  isCorrect: boolean

  
  @Column('decimal', { nullable: false})
  timestamp: number


}