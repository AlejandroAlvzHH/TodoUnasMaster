import { Routes } from '@angular/router';
import { SucursalSelectedComponent } from './components/screens/Sucursales/sucursal-selected/sucursal-selected.component';
import { HomeComponent } from './components/screens/Sucursales/home/home.component';
import { ConfiguracionComponent } from './components/screens/Configuracion/configuracion/configuracion.component';
import { CatalogoGeneralComponent } from './components/screens/Catalogo General/catalogo-general/catalogo-general.component';
import { HistoricosComponent } from './components/screens/Historicos/historicos/historicos.component';
import { EntradasysalidasComponent } from './components/screens/Sucursales/entradasysalidas/entradasysalidas.component';
import { TraspasosComponent } from './components/screens/Sucursales/traspasos/traspasos.component';
import { TraspasosClinicaComponent } from './components/screens/Sucursales/traspasos-clinica/traspasos-clinica.component';
import { LoginComponent } from './components/screens/Login/login/login.component';
import { AuthGuard } from './auth.guard';
import { InventarioSucursalComponent } from './components/screens/Sucursales/inventario-sucursal/inventario-sucursal.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'sucursalselected/:id', component: SucursalSelectedComponent, canActivate: [AuthGuard] },
  { path: 'configuracion', component: ConfiguracionComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'catalogogeneral', component: CatalogoGeneralComponent, canActivate: [AuthGuard] },
  { path: 'historicos', component: HistoricosComponent, canActivate: [AuthGuard] },
  { path: 'entradasysalidas/:id', component: EntradasysalidasComponent, canActivate: [AuthGuard] },
  { path: 'traspasos/:id', component: TraspasosComponent, canActivate: [AuthGuard] },
  { path: 'traspasosclinica/:id', component: TraspasosClinicaComponent, canActivate: [AuthGuard] },
  { path: 'inventariosucursal/:id', component: InventarioSucursalComponent, canActivate: [AuthGuard] }
];

