import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";
import {User} from "./User";

@Entity()
export class Pokemon {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 150,
        unique: true
    })
    name: string;
}