import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionNoasignacionPage } from './gestion-noasignacion.page';

describe('GestionNoasignacionPage', () => {
  let component: GestionNoasignacionPage;
  let fixture: ComponentFixture<GestionNoasignacionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionNoasignacionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionNoasignacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
