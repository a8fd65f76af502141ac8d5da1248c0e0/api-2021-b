import {Controller, Get, Post, Body} from "@nestjs/common";
import {CategoryService} from "./category.service";
import {IsInt, IsString} from "class-validator";
import {ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiProperty, ApiTags} from "@nestjs/swagger";
import {Type} from "class-transformer";

class CreateCategoryDto {
    @ApiProperty({
        type: String,
        required: true,
        description: "Category name",
    })
    @IsString()
    name: string;
}

class CategoryIdDto {
    @ApiProperty({
        type: "integer",
        required: true,
        description: "Integer field",
    })
    @Type(() => Number)
    @IsInt()
    id: number;
}

class GetCategoriesResponseDto {
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
        description: "Category name",
    })
    @IsString()
    name: string;
}

@Controller("category")
@ApiBadRequestResponse({description: "Invalid request params"})
@ApiTags("category")
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @ApiOperation({summary: "Create category"})
    @ApiCreatedResponse({type: CategoryIdDto})
    @Post()
    async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryIdDto> {
        const res = await this.categoryService.create(createCategoryDto);
        return {
            id: res.id,
        };
    }

    @ApiOperation({summary: "Get all categories"})
    @ApiOkResponse({type: GetCategoriesResponseDto, isArray: true})
    @Get()
    async findAll(): Promise<GetCategoriesResponseDto[]> {
        const res = await this.categoryService.findAll();
        return res.map((v) => ({id: v.id, name: v.name}));
    }
}
