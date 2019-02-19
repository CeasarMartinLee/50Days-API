import { Entity, PrimaryGeneratedColumn, Column,  OneToMany} from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { Length } from 'class-validator';
import Score from '../score/entity'
import { IsNumber } from 'class-validator';

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

    @OneToMany(type => Score, score => score.id)
    scores: Score[]

}