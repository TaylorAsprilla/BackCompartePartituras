import { ApiProperty } from '@nestjs/swagger';
import { Conexion } from 'src/conexiones/entities/conexion.entity';
import { UsuarioRol } from 'src/core/enums/rol.enum';
import { Partitura } from 'src/partituras/entities/partitura.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'usuarios' })
export class Usuario {
  @ApiProperty({ description: 'Identificador único del usuario', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Número Mita del usuario',
    uniqueItems: true,
    example: 12345,
  })
  @Column('integer', { unique: true })
  numeroMita: number;

  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan Pérez' })
  @Column()
  nombre: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    writeOnly: true,
    example: 'Password123!',
  })
  @Column({ select: false })
  password: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    uniqueItems: true,
    example: 'juan.perez@example.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: UsuarioRol,
    default: UsuarioRol.MUSICO,
    example: UsuarioRol.MUSICO,
  })
  @Column({
    type: 'enum',
    enum: UsuarioRol,
    default: UsuarioRol.MUSICO,
  })
  rol: UsuarioRol;

  @ApiProperty({
    description: 'Foto del usuario',
    required: false,
    example: 'https://example.com/foto.jpg',
  })
  @Column({ nullable: true })
  foto: string;

  @ApiProperty({
    description: 'Estado activo del usuario',
    default: true,
    example: true,
  })
  @Column('boolean', { default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2025-03-18T12:00:00Z',
  })
  @CreateDateColumn()
  fecha_creacion: Date;

  @ApiProperty({
    description: 'Fecha de actualización del usuario',
    example: '2025-03-18T12:00:00Z',
  })
  @UpdateDateColumn()
  fecha_actualizacion: Date;

  @ApiProperty({
    description: 'Partituras asociadas al usuario',
    type: () => [Partitura],
    example: [],
  })
  @OneToMany(() => Partitura, (partitura) => partitura.usuario)
  partituras: Partitura[];

  @ApiProperty({
    description: 'Usuario que registró a este usuario',
    type: () => Usuario,
    example: { id: 1, nombre: 'Admin' },
  })
  @ManyToOne(() => Usuario, (usuario) => usuario.registrados, {
    nullable: true,
  })
  registradoPor: Usuario;

  @ApiProperty({
    description: 'Usuarios registrados por este usuario',
    type: () => [Usuario],
    example: [],
  })
  @OneToMany(() => Usuario, (usuario) => usuario.registradoPor)
  registrados: Usuario[];

  @OneToMany(() => Conexion, (conexion) => conexion.usuario)
  conexiones: Conexion[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
