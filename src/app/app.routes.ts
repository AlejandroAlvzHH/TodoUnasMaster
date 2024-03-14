import { Routes } from '@angular/router';
import { SucursalSelectedComponent } from './sucursal-selected/sucursal-selected.component';
import { HomeComponent } from './home/home.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { CatalogoGeneralComponent } from './catalogo-general/catalogo-general.component';
import { HistoricosComponent } from './historicos/historicos.component';

export const routes: Routes = [
    {'path':'',component:HomeComponent},
    {'path':'sucursalselected/:id',component:SucursalSelectedComponent},
    {'path':'configuracion',component:ConfiguracionComponent},
    {'path':'catalogogeneral',component:CatalogoGeneralComponent},
    {'path':'historicos',component:HistoricosComponent},
];