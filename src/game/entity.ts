import { Entity, PrimaryGeneratedColumn, Column,  OneToMany} from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import Score from '../score/entity'

@Entity()
export default class Game extends BaseEntity {

    @PrimaryGeneratedColumn()
    id?: number

    @Column('integer', { nullable: false })
    level: number

    @Column('integer', { nullable: false })
    code: number

    @Column('text', { nullable: false })
    status: string

    @OneToMany(type => Score, score => score.id)
    scores: Score[]

}