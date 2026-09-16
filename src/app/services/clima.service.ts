import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';

import {
  ClimaResponse,
  GeocodingResponse,
  GeocodingResult
} from '../models/clima.interface';

@Injectable({
  providedIn: 'root'
})
export class ClimaService {

  private http = inject(HttpClient);

  private geocodingUrl =
    'https://geocoding-api.open-meteo.com/v1/search';

  private weatherUrl =
    'https://api.open-meteo.com/v1/forecast';

  buscarUbicacion(nombre: string): Observable<GeocodingResult> {

    const params = new HttpParams()
      .set('name', nombre)
      .set('count', '1')
      .set('language', 'es')
      .set('format', 'json');

    return this.http
      .get<GeocodingResponse>(
        this.geocodingUrl,
        { params }
      )
      .pipe(
        map((respuesta) => {

          const ubicacion = respuesta.results?.[0];

          if (!ubicacion) {
            throw new Error(
              'No se encontró la ubicación'
            );
          }

          return ubicacion;
        })
      );
  }

  obtenerClima(
    latitud: number,
    longitud: number
  ): Observable<ClimaResponse> {

    const params = new HttpParams()
      .set('latitude', latitud)
      .set('longitude', longitud)
      .set(
        'current',
        [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'precipitation',
          'weather_code',
          'wind_speed_10m'
        ].join(',')
      )
      .set('timezone', 'auto');

    return this.http.get<ClimaResponse>(
      this.weatherUrl,
      { params }
    );
  }

  obtenerClimaPorUbicacion(
    nombre: string
  ): Observable<ClimaResponse> {

    return this.buscarUbicacion(nombre).pipe(
      switchMap((ubicacion) =>
        this.obtenerClima(
          ubicacion.latitude,
          ubicacion.longitude
        )
      )
    );
  }
}