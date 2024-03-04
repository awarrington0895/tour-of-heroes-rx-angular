import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RxFor } from '@rx-angular/template/for';
import { map } from 'rxjs';
import { HeroSearchComponent } from '../hero-search/hero-search.component';
import { HeroService } from '../hero.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RxFor, RouterModule, HeroSearchComponent],
  template: `
    <h2>Top Heroes</h2>
    <div class="heroes-menu">
      <a *rxFor="let hero of heroes$; trackBy: 'id'" routerLink="/detail/{{hero.id}}">
        {{hero.name}}
      </a>
    </div>

    <app-hero-search></app-hero-search>
  `,
})
export class DashboardComponent {
  heroes$ = inject(HeroService)
    .getHeroes()
    .pipe(map((heroes) => heroes.slice(1, 5)));
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
