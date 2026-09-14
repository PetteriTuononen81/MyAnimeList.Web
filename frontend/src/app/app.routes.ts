import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Library } from './features/library/library';
import { Search } from './features/search/search';
import { Profile } from './features/profile/profile';
import { Login } from './features/auth/login';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'home', component: Home },
  { path: 'search', component: Search },
  { path: 'library', component: Library, canActivate: [AuthGuard]},
  { path: 'profile', component: Profile, canActivate: [AuthGuard]}
];
