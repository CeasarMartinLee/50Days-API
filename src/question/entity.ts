import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn  } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import Answer from '../answer/entity'
import { IsString } from 'class-validator';

@Entity()
export default class Question extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @Column('text', {nullable:false})
  question: string

  @OneToMany(_ => Answer, answer => answer.question)
  answer: Answer[]


}