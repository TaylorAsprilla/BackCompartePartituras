import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('partituras')
export class Partitura {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  titulo: string;

  @Column({ type: 'text', nullable: false })
  descripcion: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  pdf_url: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.partituras, { eager: true })
  usuario: Usuario;

  @ManyToOne(() => Categoria, (categoria) => categoria.partituras, {
    eager: true,
  })
  categoria: Categoria;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;
}
