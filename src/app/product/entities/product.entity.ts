import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {CategoryEntity} from "../../category/entities/category.entity";

@Entity()
export class ProductEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @Column({type: "varchar"})
    name: string;
    @Column({type: "varchar", nullable: true})
    description: string | null;
    @ManyToOne(() => CategoryEntity, {eager: true})
    category: CategoryEntity;
}
