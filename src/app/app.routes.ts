import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home';
import { Login } from './pages/login/login';
import { Services } from './pages/services/services';
import { Appointments } from './pages/appointments/appointments';
import { Masters } from './pages/masters/masters';
import { Profile } from './pages/profile/profile';
import { ManagerBookings } from './pages/manager-bookings/manager-bookings';

import { About } from './pages/about/about';
import { Pricing } from './pages/pricing/pricing';
import { Portfolio } from './pages/portfolio/portfolio';
import { Reviews } from './pages/reviews/reviews';

import { Consultation } from './pages/consultation/consultation';
import { Offers } from './pages/offers/offers';

import { authGuard, managerGuard, masterGuard } from './guards/auth.guards';

export const routes: Routes = [
  // Public routes
  { path: '', component: HomeComponent },
  { path: 'login', component: Login },
  { path: 'services', component: Services },
  { path: 'appointments', component: Appointments },
  { path: 'masters', component: Masters },
  { path: 'about', component: About },
  { path: 'pricing', component: Pricing },
  { path: 'portfolio', component: Portfolio },
  { path: 'reviews', component: Reviews },
  { path: 'consultation', component: Consultation },
  { path: 'offers', component: Offers },

  // Protected routes
  { path: 'profile', component: Profile, canActivate: [authGuard] },

  // Manager-only route
  { path: 'manager-bookings', component: ManagerBookings, canActivate: [managerGuard] },

  // Master-only route (uncomment when master-portfolio is built)
  // { path: 'master-portfolio', component: MasterPortfolio, canActivate: [masterGuard] },
];