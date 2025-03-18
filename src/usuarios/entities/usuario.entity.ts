import { UsuarioRol } from 'src/core/enums/rol.enum';
import { Partitura } from 'src/partituras/entities/partitura.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
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

  @Column({ select: false })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UsuarioRol,
    default: UsuarioRol.MUSICO,
  })
  rol: UsuarioRol;

  @Column({ nullable: true })
  foto: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;

  @OneToMany(() => Partitura, (partitura) => partitura.usuario)
  partituras: Partitura[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
