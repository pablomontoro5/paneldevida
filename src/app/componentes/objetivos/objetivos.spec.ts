import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Objetivos } from './objetivos';

describe('Objetivos', () => {
  let component: Objetivos;
  let fixture: ComponentFixture<Objetivos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Objetivos],
    }).compileComponents();

    fixture = TestBed.createComponent(Objetivos);
    fixture.componentRef.setInput('objetivos', []);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
