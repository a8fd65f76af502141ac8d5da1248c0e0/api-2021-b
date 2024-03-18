import {Injectable} from "@nestjs/common";
import {ILike, Repository} from "typeorm";
import {ProductEntity} from "./entities/product.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {CategoryEntity} from "../category/entities/category.entity";

export class CategoryNotFoundException extends Error {
    constructor() {
        super("Category not found");
    }
}

export class ProductNotFoundException extends Error {
    constructor() {
        super("Product not found");
    }
}

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepo: Repository<ProductEntity>,
        @InjectRepository(CategoryEntity)
        private readonly categoryRepo: Repository<CategoryEntity>
    ) {}

    async create(createProductDto: {name: string; description: string | null; categoryId: number}): Promise<ProductEntity> {
        const category = await this.categoryRepo.findOneBy({id: createProductDto.categoryId});
        if (!category) {
            throw new CategoryNotFoundException();
        }
        return this.productRepo.save({
            category: {id: category.id},
            name: createProductDto.name,
            description: createProductDto.description,
        });
    }

    async findAll(): Promise<ProductEntity[]> {
        return await this.productRepo.find();
    }

    async findOne(id: number): Promise<ProductEntity> {
        const product = await this.productRepo.findOneBy({id: id});
        if (!product) {
            throw new ProductNotFoundException();
        }
        return product;
    }

    async update(
        id: number,
        updateProductDto: {name: string | null; description: string | null; categoryId: number | null}
    ): Promise<ProductEntity> {
        const product = await this.productRepo.findOneBy({id: id});
        if (!product) throw new ProductNotFoundException();

        if (updateProductDto.categoryId != null) {
            const category = await this.categoryRepo.findOneBy({id: updateProductDto.categoryId});
            if (!category) throw new CategoryNotFoundException();
            product.category = category;
        }

        product.name = updateProductDto.name ?? product.name;
        product.description = updateProductDto.description;

        return await this.productRepo.save(product);
    }

    async findByQuery(query: string): Promise<ProductEntity[]> {
        return await this.productRepo.find({
            relations: ["category"],
            where: [{name: ILike(`%${query}%`)}, {description: ILike(`%${query}%`)}, {category: {name: ILike(`%${query}%`)}}],
        });
    }

    async remove(id: number) {
        const product = await this.productRepo.findOneBy({id: id});
        if (!product) throw new ProductNotFoundException();

        await this.productRepo.delete({id: id});
    }
}
