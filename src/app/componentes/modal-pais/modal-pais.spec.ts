import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPais } from './modal-pais';

describe('ModalPais', () => {
  let component: ModalPais;
  let fixture: ComponentFixture<ModalPais>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPais],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalPais);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
