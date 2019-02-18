import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'

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

}