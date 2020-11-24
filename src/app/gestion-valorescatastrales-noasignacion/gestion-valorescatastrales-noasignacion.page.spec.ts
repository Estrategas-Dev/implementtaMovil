import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionValorescatastralesNoasignacionPage } from './gestion-valorescatastrales-noasignacion.page';

describe('GestionValorescatastralesNoasignacionPage', () => {
  let component: GestionValorescatastralesNoasignacionPage;
  let fixture: ComponentFixture<GestionValorescatastralesNoasignacionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionValorescatastralesNoasignacionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionValorescatastralesNoasignacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
