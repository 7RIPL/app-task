import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  height: number;

  @Column()
  weight: number;

  @Column()
  gender: string;

  @Column()
  location: string;

  @Column()
  photoUrl: string;
}
