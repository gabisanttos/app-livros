import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotEmailPage } from './forgot-email.page';

describe('ForgotEmailPage', () => {
  let component: ForgotEmailPage;
  let fixture: ComponentFixture<ForgotEmailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
