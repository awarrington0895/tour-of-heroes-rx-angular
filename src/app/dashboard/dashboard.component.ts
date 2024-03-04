import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RxFor } from '@rx-angular/template/for';
import { map } from 'rxjs';
import { Hero } from '../hero';
import { HeroSearchComponent } from '../hero-search/hero-search.component';
import { HeroService } from '../hero.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RxFor, RouterModule, HeroSearchComponent],
  template: `
    <h2>Top Heroes</h2>
    <div class="heroes-menu">
      <a *rxFor="let hero of heroes$; trackBy: trackHero" routerLink="/detail/{{hero.id}}">
        {{hero.name}}
      </a>
    </div>

    <app-hero-search></app-hero-search>
  `,
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  heroes$ = this.heroService
    .getHeroes()
    .pipe(map((heroes) => heroes.slice(1, 5)));

  constructor(private heroService: HeroService) {}

  trackHero(_idx: number, hero: Hero) {
    return hero.id;
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
