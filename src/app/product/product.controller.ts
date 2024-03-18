import {Controller, Get, Post, Body, Param, Delete, NotFoundException, Query, Put} from "@nestjs/common";
import {CategoryNotFoundException, ProductNotFoundException, ProductService} from "./product.service";
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiProperty,
    ApiTags,
} from "@nestjs/swagger";
import {IsInt, IsOptional, IsString} from "class-validator";
import {Optional} from "../../core/common/types/optional";
import {Type} from "class-transformer";
import {BaseOkResponseDto} from "../../core/common/dto/base-ok-response.dto";

class CreateProductDto {
    @ApiProperty({
        type: String,
        required: true,
        description: "String field",
    })
    @IsString()
    name: string;
    @ApiProperty({
        type: String,
        nullable: true,
        description: "String nullable field",
    })
    @IsOptional()
    @IsString()
    description: Optional<string>;
    @ApiProperty({
        type: "integer",
        required: true,
        description: "Integer field",
    })
    @Type(() => Number)
    @IsInt()
    categoryId: number;
}

class ProductResponseDto {
    @ApiProperty({
        type: "integer",
        required: true,
        description: "Integer field",
    })
    @Type(() => Number)
    @IsInt()
    id: number;
    @ApiProperty({
        type: String,
        required: true,
        description: "String field",
    })
    @IsString()
    name: string;
    @ApiProperty({
        type: String,
        required: false,
        description: "String nullable field",
    })
    @IsOptional()
    @IsString()
    description: Optional<string>;
    @ApiProperty({
        type: "integer",
        required: true,
        description: "Integer field",
    })
    @Type(() => Number)
    @IsInt()
    categoryId: number;
}

class ProductIdDto {
    @ApiProperty({
        type: "integer",
        required: true,
        description: "Integer field",
    })
    @Type(() => Number)
    @IsInt()
    id: number;
}

class UpdateProductDto {
    @ApiProperty({
        type: String,
        required: false,
        description: "String field",
    })
    @IsOptional()
    @IsString()
    name: string;
    @ApiProperty({
        type: String,
        required: false,
        description: "String field",
    })
    @IsOptional()
    @IsString()
    description: string;
    @ApiProperty({
        type: "integer",
        required: false,
        description: "Integer field",
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    categoryId: number;
}

export class ProductQueryDto {
    @ApiProperty({
        type: String,
        required: false,
        description: "Query field",
    })
    @IsOptional()
    @IsString()
    query: string | undefined;
}

@Controller("products")
@ApiBadRequestResponse({description: "Invalid parameters"})
@ApiTags("products")
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @ApiOperation({summary: "Create product"})
    @ApiBody({type: CreateProductDto})
    @ApiCreatedResponse({type: ProductResponseDto})
    @ApiNotFoundResponse({description: "Category not found"})
    @Post()
    async create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
        try {
            const res = await this.productService.create({
                name: createProductDto.name,
                description: createProductDto.description || null,
                categoryId: createProductDto.categoryId,
            });
            return {
                id: res.id,
                categoryId: res.category.id,
                description: res.description,
                name: res.name,
            };
        } catch (e) {
            if (e instanceof CategoryNotFoundException) {
                throw new NotFoundException(e.message);
            }
            throw e;
        }
    }

    @ApiOperation({summary: "Get products by query, if query not specified all products will be returned"})
    @ApiOkResponse({type: ProductResponseDto, isArray: true})
    @Get()
    async findBy(@Query() {query}: ProductQueryDto): Promise<ProductResponseDto[]> {
        const res = query ? await this.productService.findByQuery(query) : await this.productService.findAll();
        return res.map((v) => ({id: v.id, name: v.name, description: v.description, categoryId: v.category.id}));
    }

    @ApiOperation({summary: "Get product by id"})
    @ApiOkResponse({type: ProductResponseDto})
    @ApiNotFoundResponse({description: "Product not found"})
    @Get(":id")
    async findOne(@Param() {id}: ProductIdDto): Promise<ProductResponseDto> {
        try {
            const res = await this.productService.findOne(id);
            return {
                id: res.id,
                categoryId: res.category.id,
                description: res.description,
                name: res.name,
            };
        } catch (e) {
            if (e instanceof ProductNotFoundException) {
                throw new NotFoundException(e.message);
            }
            throw e;
        }
    }

    @ApiOperation({summary: "Update product"})
    @ApiBody({type: UpdateProductDto})
    @ApiOkResponse({type: ProductIdDto})
    @ApiNotFoundResponse({description: "Product not found or category not found"})
    @Put(":id")
    async update(@Param() {id}: ProductIdDto, @Body() updateProductDto: UpdateProductDto) {
        try {
            const res = await this.productService.update(id, {
                name: updateProductDto.name ?? null,
                description: updateProductDto.description ?? null,
                categoryId: updateProductDto.categoryId ?? null,
            });
            return {
                id: res.id,
            };
        } catch (e) {
            if (e instanceof CategoryNotFoundException || e instanceof ProductNotFoundException) {
                throw new NotFoundException(e.message);
            }
            throw e;
        }
    }

    @ApiOperation({summary: "Delete product by id"})
    @ApiOkResponse({type: BaseOkResponseDto})
    @ApiNotFoundResponse({description: "Product not found"})
    @Delete(":id")
    async remove(@Param() {id}: ProductIdDto): Promise<BaseOkResponseDto> {
        try {
            await this.productService.remove(id);
            return {ok: true};
        } catch (e) {
            if (e instanceof Error) {
                throw new NotFoundException(e.message);
            }
            throw e;
        }
    }
}
