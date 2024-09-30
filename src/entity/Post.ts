import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({
    length: 100,
    nullable: false,
  })
  title: string;

  @Column({ length: 1000, nullable: false })
  content: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
