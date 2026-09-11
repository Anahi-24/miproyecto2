import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BuscadorPaisesComponent } from './componentes/buscador-paises/buscador-paises';

@Component({
  imports: [RouterOutlet, BuscadorPaisesComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('proyectopaises');
}