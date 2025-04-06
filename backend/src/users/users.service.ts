import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneById(id: number) {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async findAll(page: number, limit: number) {
    const [users, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data: users, total };
  }

  async create(userData: Partial<User>) {
    const user = this.usersRepository.create(userData);
    return await this.usersRepository.save(user);
  }

  async update(id: number, userData: Partial<User>) {
    // Находим пользователя по ID
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    // Удаляем старое изображение, если оно существует
    if (userData.photoUrl && user.photoUrl) {
      const uploadsDir = 'uploads'; // Путь к папке с изображениями
      const oldFilePath = path.join(uploadsDir, path.basename(user.photoUrl));

      try {
        await fs.promises.access(oldFilePath); // Проверяем, существует ли файл
        await fs.promises.unlink(oldFilePath); // Удаляем старый файл
      } catch (error) {
        console.error("Ошибка при удалении старого файла:", error);
      }
    }

    // Обновляем запись пользователя
    await this.usersRepository.update(id, userData);

    return await this.usersRepository.findOne({ where: { id } });
  }

  async delete(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    if (user.photoUrl) {
      const uploadsDir = 'uploads';
      const filePath = path.join(uploadsDir, path.basename(user.photoUrl));

      try {
        await fs.promises.access(filePath);
        await fs.promises.unlink(filePath);
      } catch (error) {
        console.error("Ошибка при удалении файла:", error);
      }
    }

    await this.usersRepository.delete(id);
    return { message: "Пользователь удален" };
  }

  async savePhotoUrl(userId: number, photoUrl: string) {
    await this.usersRepository.update(userId, { photoUrl });
    return { message: "Фото обновлено", photoUrl };
  }

  async checkPhotoExists(filename: string): Promise<boolean> {
    const uploadsDir = 'uploads';
    const filePath = path.join(uploadsDir, filename);

    try {
      await fs.promises.access(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }
}