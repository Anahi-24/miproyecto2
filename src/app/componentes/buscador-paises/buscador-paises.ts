import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { Pais } from '../../models/pais.interface';
 // import { Router } from '@angular/router';
import { ClimaService } from '../../services/clima.service';
import { ModalPaisComponent } from '../modal-pais/modal-pais';

@Component({
  selector: 'app-buscador-paises',
  standalone: true,
  imports: [FormsModule, ModalPaisComponent],
  templateUrl: './buscador-paises.html',
  styleUrl: './buscador-paises.css'
})
export class BuscadorPaisesComponent {
  private paisesService = inject(PaisesService);
  // private router = inject(Router);
  private climaService = inject(ClimaService);
  termino = signal('');
  todosPaises = signal<Pais[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);
  modalAbierto = signal(false);
  paisSeleccionado = signal<Pais | null>(null);
  vistaModal = signal<'detalles' | 'clima'>('detalles');


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
    this.paisSeleccionado.set(pais);
    this.vistaModal.set('detalles');
    this.modalAbierto.set(true);
  }

  verClima(pais: Pais): void {
    this.paisSeleccionado.set(pais);
    this.vistaModal.set('clima');
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
    this.paisSeleccionado.set(null);
  }

} 