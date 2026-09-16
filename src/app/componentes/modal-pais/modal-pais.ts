import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  inject,
  signal
} from '@angular/core';

import { DecimalPipe } from '@angular/common';

import { Pais } from '../../models/pais.interface';

import { ClimaService } from '../../services/clima.service';

import {
  ClimaResponse,
  GeocodingResult
} from '../../models/clima.interface';


@Component({
  selector: 'app-modal-pais',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './modal-pais.html',
  styleUrl: './modal-pais.css'
})
export class ModalPaisComponent implements OnChanges {

  private climaService = inject(ClimaService);


  @Input() pais: Pais | null = null;

  @Input() vista: 'detalles' | 'clima' = 'detalles';

  @Output() cerrar = new EventEmitter<void>();


  // ==============================
  // DATOS DEL CLIMA
  // ==============================

  clima = signal<ClimaResponse | null>(null);

  ubicacion = signal<GeocodingResult | null>(null);

  cargandoClima = signal(false);

  errorClima = signal<string | null>(null);


  // ==============================
  // DETECTAR CAMBIO DE VISTA
  // ==============================

  ngOnChanges(changes: SimpleChanges): void {

    if (
      (changes['vista'] || changes['pais']) &&
      this.vista === 'clima' &&
      this.pais
    ) {
      this.cargarClima();
    }

  }


  // ==============================
  // CARGAR CLIMA
  // ==============================

  private cargarClima(): void {

    if (!this.pais) {
      return;
    }

    this.cargandoClima.set(true);

    this.errorClima.set(null);

    this.clima.set(null);

    this.ubicacion.set(null);


    const nombrePais = this.nombreEnEspanol(this.pais);


    this.climaService.buscarUbicacion(nombrePais).subscribe({

      next: (ubicacion) => {

        this.ubicacion.set(ubicacion);


        this.climaService
          .obtenerClima(
            ubicacion.latitude,
            ubicacion.longitude
          )
          .subscribe({

            next: (datos) => {

              console.log('Clima recibido:', datos);

              this.clima.set(datos);

              this.cargandoClima.set(false);

            },

            error: (error) => {

              console.error(
                'Error obteniendo clima:',
                error
              );

              this.errorClima.set(
                'No se pudo obtener la información meteorológica.'
              );

              this.cargandoClima.set(false);

            }

          });

      },

      error: (error) => {

        console.error(
          'Error buscando ubicación:',
          error
        );

        this.errorClima.set(
          'No se pudo encontrar una ubicación para consultar el clima.'
        );

        this.cargandoClima.set(false);

      }

    });

  }


  // ==============================
  // NOMBRE EN ESPAÑOL
  // ==============================

  nombreEnEspanol(pais: Pais): string {

    return (
      pais.names.translations?.['spa']?.common ??
      pais.names.common
    );

  }


  // ==============================
  // CAPITAL
  // ==============================

  obtenerCapital(pais: Pais): string {

    return (
      pais.capitals?.[0]?.name ??
      'No disponible'
    );

  }


  // ==============================
  // IDIOMAS
  // ==============================

  obtenerIdiomas(pais: Pais): string {

    if (
      !pais.languages ||
      pais.languages.length === 0
    ) {
      return 'No disponible';
    }

    return pais.languages
      .map((idioma) => idioma.name)
      .join(', ');

  }


  // ==============================
  // MONEDAS
  // ==============================

  obtenerMonedas(pais: Pais): string {

    if (!pais.currencies) {
      return 'No disponible';
    }

    return Object.values(pais.currencies)
      .map((moneda) => {

        if (moneda.symbol) {
          return `${moneda.name} (${moneda.symbol})`;
        }

        return moneda.name;

      })
      .join(', ');

  }


  // ==============================
  // DESCRIPCIÓN DEL CLIMA
  // ==============================

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

      77: 'Granizo de nieve',

      80: 'Chubascos ligeros',
      81: 'Chubascos moderados',
      82: 'Chubascos intensos',

      85: 'Chubascos de nieve ligeros',
      86: 'Chubascos de nieve intensos',

      95: 'Tormenta eléctrica',

      96: 'Tormenta con granizo ligero',
      99: 'Tormenta con granizo intenso'

    };

    return descripciones[codigo] ?? 'Condiciones desconocidas';

  }


  // ==============================
  // ICONO DEL CLIMA
  // ==============================

  obtenerIconoClima(codigo: number): string {

    if (codigo === 0) {
      return '☀';
    }

    if (codigo === 1 || codigo === 2) {
      return '◐';
    }

    if (codigo === 3) {
      return '☁';
    }

    if (
      codigo >= 45 &&
      codigo <= 48
    ) {
      return '≋';
    }

    if (
      codigo >= 51 &&
      codigo <= 67
    ) {
      return '☂';
    }

    if (
      codigo >= 71 &&
      codigo <= 86
    ) {
      return '❄';
    }

    if (
      codigo >= 95 &&
      codigo <= 99
    ) {
      return 'ϟ';
    }

    return '☀';

  }

  // ==============================
  // CERRAR MODAL
  // ==============================

  cerrarModal(): void {

    this.cerrar.emit();

  }
}