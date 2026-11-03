import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Viajes } from './viajes';

describe('Viajes', () => {
  let component: Viajes;
  let fixture: ComponentFixture<Viajes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Viajes],
    }).compileComponents();

    fixture = TestBed.createComponent(Viajes);
    fixture.componentRef.setInput('viajes', []);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sin viajes muestra el mensaje de lista vacía', () => {
    const texto = (fixture.nativeElement as HTMLElement).textContent;
    expect(texto).toContain('No tienes viajes a la vista.');
  });
});
