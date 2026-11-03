import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TusDatos } from './tus-datos';

describe('TusDatos', () => {
  let component: TusDatos;
  let fixture: ComponentFixture<TusDatos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TusDatos],
    }).compileComponents();

    fixture = TestBed.createComponent(TusDatos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
