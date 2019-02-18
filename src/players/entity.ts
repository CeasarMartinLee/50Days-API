import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { MinLength, IsString } from 'class-validator';

@Entity()
export default class Player {
  @PrimaryGeneratedColumn()
  id: string

  @IsString()
  @MinLength(3)
  @Column({nullable: false})
  username: string
}

