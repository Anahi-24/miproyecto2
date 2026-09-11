import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { Pais } from '../../models/pais.interface';
import { Router } from '@angular/router';
import { ClimaService } from '../../services/clima.service';

@Component({
  selector: 'app-buscador-paises',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './buscador-paises.html',
  styleUrl: './buscador-paises.css'
})
export class BuscadorPaisesComponent {
  private paisesService = inject(PaisesService);
  private router = inject(Router);
  private climaService = inject(ClimaService);
  termino = signal('');
  todosPaises = signal<Pais[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  // Filtro reactivo: se recalcula solo cuando cambian termino() o todosPaises()
  paises = computed(() => {
  const texto = this.normalizar(this.termino().trim());
  if (!texto) return [];
  return this.todosPaises().filter((p) => {
    const nombreEs = this.normalizar(this.nombreEnEspanol(p));
    return nombreEs.startsWith(texto);
  });
});


  constructor() {
    this.paisesService.getTodosCompletos().subscribe({
      next: (data) => {
        this.todosPaises.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de países');
        this.cargando.set(false);
      }
    });
  }

  onInputChange(valor: string): void {
    this.termino.set(valor);
  }

  nombreEnEspanol(pais: Pais): string {
  return pais.names.translations?.['spa']?.common ?? pais.names.common;
}
private normalizar(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

verDetalles(pais: Pais): void {
    this.router.navigate(['/pais', pais.codes.alpha_3]);
  }

verClima(pais: Pais): void {
  const codigo = pais.codes.alpha_3;

  console.log('CLIMA - código:', codigo);
  console.log('CLIMA - URL antes:', window.location.href);

  this.router.navigateByUrl('/clima/' + codigo)
    .then((resultado) => {
      console.log('CLIMA - navegación:', resultado);
      console.log('CLIMA - URL después:', window.location.href);
    })
    .catch((error) => {
      console.error('CLIMA - error:', error);
    });
}

} 