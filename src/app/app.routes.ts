import { Routes } from '@angular/router';
import { SucursalSelectedComponent } from './components/screens/Sucursales/sucursal-selected/sucursal-selected.component';
import { HomeComponent } from './components/screens/Sucursales/home/home.component';
import { ConfiguracionComponent } from './components/screens/Configuracion/configuracion/configuracion.component';
import { CatalogoGeneralComponent } from './components/screens/Catalogo General/catalogo-general/catalogo-general.component';
import { HistoricosComponent } from './components/screens/Historicos/historicos/historicos.component';

export const routes: Routes = [
    {'path':'',component:HomeComponent},
    {'path':'sucursalselected/:id',component:SucursalSelectedComponent},
    {'path':'configuracion',component:ConfiguracionComponent},
    {'path':'catalogogeneral',component:CatalogoGeneralComponent},
    {'path':'historicos',component:HistoricosComponent},
];