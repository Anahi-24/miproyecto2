import { Routes } from '@angular/router';
import { BuscadorPaisesComponent } from './componentes/buscador-paises/buscador-paises';
import { PaisDetalleComponent } from './componentes/pais-detalle/pais-detalle';
import { ClimaComponent } from './componentes/clima/clima';

export const routes: Routes = [
  {
    path: '',
    component: BuscadorPaisesComponent
  },
  {
    path: 'pais/:codigo',
    component: PaisDetalleComponent
  },
  {
    path: 'clima/:codigo',
    component: ClimaComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];