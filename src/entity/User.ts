import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";
import {UserGroup} from "./UserGroup";
import {Pokemon} from "./Pokemon";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column()
    phone: string;

    @Column()
    salt: string;

    @Column()
    provider: string;

    @ManyToMany(type => UserGroup, {
        cascadeInsert: true
    })
    @JoinTable()
    userGroups: UserGroup[];

    @ManyToMany(type => Pokemon)
    @JoinTable()
    pokemons: Pokemon[];

}