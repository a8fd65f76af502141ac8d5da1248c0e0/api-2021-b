import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class CategoryEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({type: "varchar"})
    name: string;
}
