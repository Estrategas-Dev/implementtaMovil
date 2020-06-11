import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCartaInvitacionPage } from './gestion-carta-invitacion.page';

describe('GestionCartaInvitacionPage', () => {
  let component: GestionCartaInvitacionPage;
  let fixture: ComponentFixture<GestionCartaInvitacionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionCartaInvitacionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionCartaInvitacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
