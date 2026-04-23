import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home';
import { Services } from './pages/services/services';
import { Appointments } from './pages/appointments/appointments';
import { Profile } from './pages/profile/profile';

import { MastersComponent } from './pages/masters/masters.component';


import { About } from './pages/about/about';
import { Pricing } from './pages/pricing/pricing';
import { Portfolio } from './pages/portfolio/portfolio';
import { Reviews } from './pages/reviews/reviews';

import { Consultation } from './pages/consultation/consultation';
import { Offers } from './pages/offers/offers';

import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'services', component: Services },
  { path: 'appointments', component: Appointments },

  // 👇 MASTERS
  { path: 'masters', component: MastersComponent },

  { path: 'profile', component: Profile, canActivate: [authGuard] },

  { path: 'about', component: About },
  { path: 'pricing', component: Pricing },
  { path: 'portfolio', component: Portfolio },
  { path: 'reviews', component: Reviews },

  { path: 'consultation', component: Consultation },
  { path: 'offers', component: Offers },

  { path: 'login', component: LoginComponent },
];