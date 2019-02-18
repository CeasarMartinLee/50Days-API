import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { MinLength, IsString, IsEmail } from 'class-validator';

@Entity()
export default class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @IsString()
  @MinLength(3)
  @Column()
  username: string

  @IsEmail()
  @Column()
  email:string

}