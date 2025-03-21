import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Conexion } from './entities/conexion.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { GeolocalizacionData } from './interface/geolocalizacionData.interface';
import { ConfigService } from '@nestjs/config';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class ConexionesService {
  constructor(
    @InjectRepository(Conexion)
    private readonly conexionRepository: Repository<Conexion>,
    private readonly configService: ConfigService,
  ) {}

  async getGeolocalizacionData(
    ipRequest: string | undefined,
    usuario: Usuario,
  ): Promise<Conexion> {
    const ip = ipRequest || '1';

    const response = await axios.get<GeolocalizacionData>(
      this.configService.get('IP_API') + ip,
    );

    const data: GeolocalizacionData = response.data;

    const conexion = this.conexionRepository.create({
      query: data.query,
      status: data.status,
      continent: data.continent,
      continentCode: data.continentCode,
      country: data.country,
      countryCode: data.countryCode,
      region: data.region,
      regionName: data.regionName,
      city: data.city,
      district: data.district,
      zip: data.zip,
      lat: data.lat,
      lon: data.lon,
      timezone: data.timezone,
      offset: data.offset,
      currency: data.currency,
      isp: data.isp,
      org: data.org,
      as: data.as,
      asname: data.asname,
      mobile: data.mobile,
      proxy: data.proxy,
      hosting: data.hosting,
      usuario,
    });

    return this.conexionRepository.save(conexion);
  }
}
