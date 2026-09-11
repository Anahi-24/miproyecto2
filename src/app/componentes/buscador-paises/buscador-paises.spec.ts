import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorPaises } from './buscador-paises';

describe('BuscadorPaises', () => {
  let component: BuscadorPaises;
  let fixture: ComponentFixture<BuscadorPaises>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscadorPaises],
    }).compileComponents();

    fixture = TestBed.createComponent(BuscadorPaises);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
