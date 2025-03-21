import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Conexion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  query: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  continent: string;

  @Column({ nullable: true })
  continentCode: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  countryCode: string;

  @Column({ nullable: true })
  region: string;

  @Column({ nullable: true })
  regionName: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  zip: string;

  @Column('float', { nullable: true })
  lat: number;

  @Column('float', { nullable: true })
  lon: number;

  @Column({ nullable: true })
  timezone: string;

  @Column({ nullable: true })
  offset: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  isp: string;

  @Column({ nullable: true })
  org: string;

  @Column({ nullable: true })
  as: string;

  @Column({ nullable: true })
  asname: string;

  @Column({ nullable: true })
  mobile: boolean;

  @Column({ nullable: true })
  proxy: boolean;

  @Column({ nullable: true })
  hosting: boolean;

  @ManyToOne(() => Usuario, (usuario) => usuario.conexiones)
  usuario: Usuario;
}
