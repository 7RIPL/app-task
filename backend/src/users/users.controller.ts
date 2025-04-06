import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import { extname } from "path";
import { Express } from "express";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return this.usersService.findOneById(Number(id));
  }


  @Get(':id/photo-exists/:filename')
  async checkPhotoExists(@Param('id') id: string, @Param('filename') filename: string): Promise<boolean> {
    return this.usersService.checkPhotoExists(filename);
  }

  @Get()
  async getUsers(@Query("page") page = 1, @Query("limit") limit = 10) {
    return this.usersService.findAll(Number(page), Number(limit));
  }

  @Post()
  async createUser(@Body() userData: Partial<User>) {
    return this.usersService.create(userData);
  }

  @Put(":id")
  async updateUser(@Param("id") id: number, @Body() userData: Partial<User>) {
    return this.usersService.update(Number(id), userData);
  }

  @Delete(":id")
  async deleteUser(@Param("id") id: number) {
    return this.usersService.delete(Number(id));
  }

  @Post("/upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (_req, file, callback) => {
          const uniqueSuffix = uuidv4();
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    })
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { photoUrl: `http://localhost:5000/uploads/${file.filename}` }; // <-- теперь полный путь
  }
}
