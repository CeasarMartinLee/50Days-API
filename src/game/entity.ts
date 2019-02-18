import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { Length, IsNumber } from 'class-validator';

@Entity()
export default class Game extends BaseEntity {

    @PrimaryGeneratedColumn()
    id?: number

    @IsNumber()
    @Column('integer', { nullable: false })
    level: number

    // @Length(4)
    @IsNumber()
    @Column('integer', { nullable: false })
    code: number

    @Column('text', { nullable: false })
    status: string

}