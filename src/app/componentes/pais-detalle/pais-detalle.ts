import { Component, inject, signal } from '@angular/core';
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
export class PaisDetalleComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private paisesService = inject(PaisesService);

  pais = signal<Pais | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null);

  constructor() {
    const codigo = this.route.snapshot.paramMap.get('codigo');
    if (!codigo) {
      this.error.set('Código de país no válido');
      this.cargando.set(false);
      return;
    }

    this.paisesService.buscarPorCodigo(codigo).subscribe({
      next: (resultados) => {
        this.pais.set(resultados[0] ?? null);
        if (!resultados[0]) {
          this.error.set('No se encontró el país');
        }
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la información del país');
        this.cargando.set(false);
      }
    });
  }

  nombreEnEspanol(pais: Pais): string {
    return pais.names.translations?.['spa']?.common ?? pais.names.common;
  }

  volver(): void {
    this.router.navigate(['/']);
  }
}