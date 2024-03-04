import { NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { filter, map, startWith, mergeMap, tap } from 'rxjs';
import { RxFor } from '@rx-angular/template/for';
import { rxState } from '@rx-angular/state';
import { rxActions } from '@rx-angular/state/actions';
import { rxEffects } from '@rx-angular/state/effects';

type HeroesActions = {
  delete: Hero;
  add: string;
};

@Component({
  standalone: true,
  selector: 'app-heroes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, NgForOf, RxFor],
  styleUrls: ['./heroes.component.css'],
  template: `
  <h2>My Heroes</h2>

  <div>
    <label for="new-hero">Hero name: </label>
    <input id="new-hero" #heroName />
  
    <!-- (click) passes input value to add() and then clears the input -->
    <button
      type="button"
      class="add-button"
      (click)="actions.add(heroName.value); heroName.value = ''"
    >
      Add hero
    </button>
  </div>
  
  <ul class="heroes">
    <li *rxFor="let hero of heroes$; trackBy: 'id'">
      <a routerLink="/detail/{{ hero.id }}">
        <span class="badge">{{ hero.id }}</span> {{ hero.name }}
      </a>
      <button
        type="button"
        class="delete"
        title="delete hero"
        (click)="actions.delete(hero)"
      >
        x
      </button>
    </li>
  </ul>
  
  <!-- 
  Copyright Google LLC. All Rights Reserved.
  Use of this source code is governed by an MIT-style license that
  can be found in the LICENSE file at https://angular.io/license
  -->
  `
})
export class HeroesComponent {

  private readonly heroService = inject(HeroService);

  private readonly state = rxState<{ heroes: Hero[] }>(({ connect }) => {
    connect('heroes', this.heroService.getHeroes().pipe(startWith([])));
  })

  readonly actions = rxActions<HeroesActions>();

  readonly effects = rxEffects(({ register }) => {
    const addEffect$ = this.actions.add$.pipe(
      map((name) => name.trim()),
      filter(Boolean),
      mergeMap((name) => this.heroService.addHero({ name } as Hero)),
      tap((hero) => this.state.set('heroes', (s) => [...s.heroes, hero]))
    );

    const deleteEffect$ = this.actions.delete$.pipe(
      tap((hero) =>
        this.state.set('heroes', (s) =>
          s.heroes.filter((h) => h.id !== hero.id)
        )
      ),
      mergeMap((hero) => this.heroService.deleteHero(hero.id))
    );

    register(addEffect$);
    register(deleteEffect$);
  });

  readonly heroes$ = this.state.select('heroes');
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
