import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, expand, reduce, EMPTY } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pais, RestCountriesResponse } from '../models/pais.interface';

@Injectable({ providedIn: 'root' })
export class PaisesService {
  private http = inject(HttpClient);
  private baseUrl = environment.restCountriesApiUrl;

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${environment.restCountriesApiKey}`
    });
  }

  // Trae TODOS los países paginando automáticamente hasta agotar el listado
  getTodosCompletos(): Observable<Pais[]> {
    const limit = 100;
    const campos = 'names.common,names.translations,codes.alpha_2,codes.alpha_3,region,subregion,flag.url_png,flag.description';

    const traerPagina = (offset: number) =>
      this.http
        .get<RestCountriesResponse>(
          `${this.baseUrl}?limit=${limit}&offset=${offset}&response_fields=${campos}`,
          { headers: this.headers }
        )
        .pipe(
          map((res) => ({
            items: res.data?.objects ?? [],
            more: res.data?.meta?.more ?? false,
            offset
          }))
        );

    return traerPagina(0).pipe(
      expand(({ more, offset }) => (more ? traerPagina(offset + limit) : EMPTY)),
      reduce((acumulado, pagina) => [...acumulado, ...pagina.items], [] as Pais[])
    );
  }

  buscarPorNombre(nombre: string): Observable<Pais[]> {
    return this.http
      .get<RestCountriesResponse>(
        `${this.baseUrl}/name?q=${encodeURIComponent(nombre)}`,
        { headers: this.headers }
      )
      .pipe(map((res) => res.data?.objects ?? []));
  }

  buscarPorCodigo(codigo: string): Observable<Pais[]> {
    const propiedad = codigo.length === 2 ? 'codes.alpha_2' : 'codes.alpha_3';
    return this.http
      .get<RestCountriesResponse>(
        `${this.baseUrl}/${propiedad}/${codigo}`,
        { headers: this.headers }
      )
      .pipe(map((res) => res.data?.objects ?? []));
  }

  buscarPorRegion(region: string): Observable<Pais[]> {
    return this.http
      .get<RestCountriesResponse>(
        `${this.baseUrl}/region/${encodeURIComponent(region)}`,
        { headers: this.headers }
      )
      .pipe(map((res) => res.data?.objects ?? []));
  }
}