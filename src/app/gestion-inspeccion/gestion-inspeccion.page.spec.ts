import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionInspeccionPage } from './gestion-inspeccion.page';

describe('GestionInspeccionPage', () => {
  let component: GestionInspeccionPage;
  let fixture: ComponentFixture<GestionInspeccionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionInspeccionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionInspeccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
