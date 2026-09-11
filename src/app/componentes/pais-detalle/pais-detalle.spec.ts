import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaisDetalle } from './pais-detalle';

describe('PaisDetalle', () => {
  let component: PaisDetalle;
  let fixture: ComponentFixture<PaisDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaisDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(PaisDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
