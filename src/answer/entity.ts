import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import Question from '../question/entity'
import { IsString, IsBoolean } from 'class-validator';

@Entity()
export default class Answer extends BaseEntity { 

  @PrimaryGeneratedColumn()
  id?: number

  @IsString()
  @Column('text', {nullable:false})
  answer: string

  @IsBoolean()
  @Column('boolean', {nullable:false})
  isCorrect: boolean

  @ManyToOne(_ => Question, question => question.answer)
  question: Question

}