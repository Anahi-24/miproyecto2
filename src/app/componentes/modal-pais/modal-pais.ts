import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { ClimaComponent } from '../clima/clima';
import { Pais } from '../../models/pais.interface';
import { PaisDetalleComponent } from '../pais-detalle/pais-detalle';

@Component({
  selector: 'app-modal-pais',
  standalone: true,
  imports: [
  ClimaComponent,
  PaisDetalleComponent
],
  templateUrl: './modal-pais.html',
  styleUrl: './modal-pais.css'
})
export class ModalPaisComponent {

  @Input() pais: Pais | null = null;

  @Input() vista: 'detalles' | 'clima' = 'detalles';

  @Output() cerrar = new EventEmitter<void>();


  cerrarModal(): void {

    this.cerrar.emit();

  }

}