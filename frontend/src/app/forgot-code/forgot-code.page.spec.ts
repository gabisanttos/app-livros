import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotCodePage } from './forgot-code.page';

describe('ForgotCodePage', () => {
  let component: ForgotCodePage;
  let fixture: ComponentFixture<ForgotCodePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
