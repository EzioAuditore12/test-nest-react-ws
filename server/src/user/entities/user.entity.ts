import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Algorithm } from '@node-rs/argon2';

import type { Role } from '../enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true, nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: false })
  approved: boolean;

  @OneToMany((type) => Project, (project) => project.owner)
  @JoinColumn({ name: 'ownerId' })
  projectsOwned: Project[];

  @OneToMany((type) => Project, (project) => project.assignee)
  @JoinColumn({ name: 'assigneeId' })
  projectsAssigned: Project[];

  @Column({ nullable: false })
  role: Role;

  @Column({ nullable: true })
  fullName?: string;

  @Column({ nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  careerDetails?: string;

  @Column({ length: 13, nullable: true })
  telephone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  profileImageUrl?: string;

  @OneToMany((type) => Chat, (chat) => chat.userOne)
  @JoinColumn({ name: 'userOneId' })
  chatOne: Chat[];

  @OneToMany((type) => Chat, (chat) => chat.userTwo)
  @JoinColumn({ name: 'userTwoId' })
  chatTwo: Chat[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await Algorithm.Arg;

    return hash === this.password;
  }
}
