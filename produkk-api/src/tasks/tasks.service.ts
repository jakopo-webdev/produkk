import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import type { Redis } from 'ioredis';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async findAll(userId: number): Promise<Task[]> {
    const key = `tasks:user:${userId}`;
    const cached = await this.redis.get(key);
    if (cached) return JSON.parse(cached) as Task[];

    const tasks = await this.tasksRepository.find({ where: { userId } });
    await this.redis.set(key, JSON.stringify(tasks), 'EX', 30); // 30s TTL
    return tasks;
  }

  async findOne(id: number, userId: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id, userId } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  create(dto: CreateTaskDto, userId: number): Promise<Task> {
    const task = this.tasksRepository.create({ ...dto, userId });
    return this.tasksRepository.save(task).then(async (t) => {
      // invalidate cache for this user
      await this.redis.del(`tasks:user:${userId}`);
      return t;
    });
  }

  async update(id: number, dto: UpdateTaskDto, userId: number): Promise<Task> {
    const task = await this.findOne(id, userId);
    Object.assign(task, dto);
    await this.tasksRepository.save(task);
    await this.redis.del(`tasks:user:${userId}`);
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.tasksRepository.remove(task);
    await this.redis.del(`tasks:user:${userId}`);
  }
}
