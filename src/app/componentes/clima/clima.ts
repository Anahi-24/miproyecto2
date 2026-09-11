import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PaisesService } from '../../services/paises.service';
import { ClimaService } from '../../services/clima.service';
import { Pais } from '../../models/pais.interface';
import { ClimaResponse, GeocodingResult } from '../../models/clima.interface';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-clima',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './clima.html',
  styleUrl: './clima.css'
})
export class ClimaComponent {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private paisesService = inject(PaisesService);
  private climaService = inject(ClimaService);

  pais = signal<Pais | null>(null);
  ubicacion = signal<GeocodingResult | null>(null);
  clima = signal<ClimaResponse | null>(null);

  cargando = signal(true);
  error = signal<string | null>(null);

  constructor() {

    const codigo = this.route.snapshot.paramMap.get('codigo');

    if (!codigo) {
      this.error.set('Código de país no válido');
      this.cargando.set(false);
      return;
    }

    this.cargarClima(codigo);
  }

  private cargarClima(codigo: string): void {

  console.log('1. Iniciando carga del clima. Código:', codigo);

  this.paisesService.buscarPorCodigo(codigo).subscribe({

    next: (resultados) => {

      console.log('2. País recibido:', resultados);

      const paisEncontrado = resultados[0];

      if (!paisEncontrado) {
        console.log('3. No se encontró el país');

        this.error.set('No se encontró el país');
        this.cargando.set(false);
        return;
      }

      this.pais.set(paisEncontrado);

      const nombrePais = this.nombreEnEspanol(paisEncontrado);

      console.log('3. País encontrado:', nombrePais);
      console.log('4. Buscando ubicación en Open-Meteo...');

      this.climaService.buscarUbicacion(nombrePais).subscribe({

        next: (ubicacion) => {

          console.log('5. Ubicación encontrada:', ubicacion);
          console.log(
            '6. Coordenadas:',
            ubicacion.latitude,
            ubicacion.longitude
          );

          this.ubicacion.set(ubicacion);

          console.log('7. Consultando clima...');

          this.climaService
            .obtenerClima(
              ubicacion.latitude,
              ubicacion.longitude
            )
            .subscribe({

              next: (datosClima) => {

                console.log('8. CLIMA RECIBIDO:', datosClima);

                this.clima.set(datosClima);
                this.cargando.set(false);
              },

              error: (error) => {

                console.error('ERROR 8. Obteniendo clima:', error);

                this.error.set(
                  'No se pudo obtener la información del clima'
                );

                this.cargando.set(false);
              }

            });
        },

        error: (error) => {

          console.error('ERROR 5. Buscando ubicación:', error);

          this.error.set(
            'No se pudo encontrar la ubicación del país'
          );

          this.cargando.set(false);
        }

      });
    },

    error: (error) => {

      console.error('ERROR 2. Obteniendo país:', error);

      this.error.set(
        'No se pudo cargar la información del país'
      );

      this.cargando.set(false);
    }

  });
}

  nombreEnEspanol(pais: Pais): string {
    return pais.names.translations?.['spa']?.common
      ?? pais.names.common;
  }

  volver(): void {
    this.router.navigate(['/']);
  }

  obtenerDescripcionClima(codigo: number): string {

    const descripciones: Record<number, string> = {

      0: 'Cielo despejado',

      1: 'Principalmente despejado',
      2: 'Parcialmente nublado',
      3: 'Nublado',

      45: 'Niebla',
      48: 'Niebla con escarcha',

      51: 'Llovizna ligera',
      53: 'Llovizna moderada',
      55: 'Llovizna intensa',

      56: 'Llovizna helada ligera',
      57: 'Llovizna helada intensa',

      61: 'Lluvia ligera',
      63: 'Lluvia moderada',
      65: 'Lluvia intensa',

      66: 'Lluvia helada ligera',
      67: 'Lluvia helada intensa',

      71: 'Nevada ligera',
      73: 'Nevada moderada',
      75: 'Nevada intensa',

      77: 'Granos de nieve',

      80: 'Chubascos ligeros',
      81: 'Chubascos moderados',
      82: 'Chubascos intensos',

      85: 'Chubascos de nieve ligeros',
      86: 'Chubascos de nieve intensos',

      95: 'Tormenta eléctrica',
      96: 'Tormenta con granizo ligero',
      99: 'Tormenta con granizo intenso'
    };

    return descripciones[codigo] ?? 'Condición desconocida';
  }

  obtenerIconoClima(codigo: number): string {

    if (codigo === 0) return '☀️';

    if (codigo === 1 || codigo === 2) return '🌤️';

    if (codigo === 3) return '☁️';

    if ([45, 48].includes(codigo)) return '🌫️';

    if (
      [51, 53, 55, 56, 57,
       61, 63, 65, 66, 67,
       80, 81, 82].includes(codigo)
    ) {
      return '🌧️';
    }

    if (
      [71, 73, 75, 77,
       85, 86].includes(codigo)
    ) {
      return '❄️';
    }

    if ([95, 96, 99].includes(codigo)) {
      return '⛈️';
    }

    return '🌡️';
  }
}