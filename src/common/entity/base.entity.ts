import { IsDate, IsInt } from "class-validator";
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseModel {
    @PrimaryGeneratedColumn()
    id: number;

    @UpdateDateColumn()
    updatedAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}