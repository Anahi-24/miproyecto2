import {
  Component,
  Input,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';

import { PaisesService } from '../../services/paises.service';
import { Pais } from '../../models/pais.interface';


@Component({
  selector: 'app-pais-detalle',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './pais-detalle.html',
  styleUrl: './pais-detalle.css'
})
export class PaisDetalleComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private paisesService = inject(PaisesService);


  @Input() paisInput: Pais | null = null;

  @Input() dentroModal = false;


  pais = signal<Pais | null>(null);

  cargando = signal(true);

  error = signal<string | null>(null);


  ngOnInit(): void {

    /*
     * =========================================
     * DENTRO DEL MODAL
     * =========================================
     */

    if (this.dentroModal) {

      this.pais.set(this.paisInput);

      this.cargando.set(false);

      return;
    }


    /*
     * =========================================
     * PÁGINA /pais/:codigo
     * =========================================
     */

    const codigo =
      this.route.snapshot.paramMap.get('codigo');


    if (!codigo) {

      this.error.set(
        'Código de país no válido'
      );

      this.cargando.set(false);

      return;
    }


    this.paisesService
      .buscarPorCodigo(codigo)
      .subscribe({

        next: (resultados) => {

          const resultado =
            resultados[0] ?? null;


          this.pais.set(resultado);


          if (!resultado) {

            this.error.set(
              'No se encontró el país'
            );

          }


          this.cargando.set(false);

        },


        error: () => {

          this.error.set(
            'No se pudo cargar la información del país'
          );

          this.cargando.set(false);

        }

      });

  }


  nombreEnEspanol(pais: Pais): string {

    return (
      pais.names.translations?.['spa']?.common
      ?? pais.names.common
    );

  }


  volver(): void {

    this.router.navigate(['/']);

  }

}