import { UsuarioRol } from 'src/core/enums/rol.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer', { unique: true })
  numeroMita: number;

  @Column()
  nombre: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UsuarioRol,
    default: UsuarioRol.MUSICO,
  })
  rol: string;

  @Column({ nullable: true })
  foto: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;
}
