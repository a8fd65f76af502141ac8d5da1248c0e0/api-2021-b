import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {CategoryEntity} from "./entities/category.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly repo: Repository<CategoryEntity>
    ) {}

    async create(createCategoryDto: {name: string}): Promise<CategoryEntity> {
        return await this.repo.save({name: createCategoryDto.name});
    }

    async findAll(): Promise<CategoryEntity[]> {
        return await this.repo.find();
    }
}
