import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagerBookings } from './manager-bookings';

describe('ManagerBookings', () => {
  let component: ManagerBookings;
  let fixture: ComponentFixture<ManagerBookings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerBookings],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerBookings);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});