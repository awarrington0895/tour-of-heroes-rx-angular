import { NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { filter, map, startWith, mergeMap, tap } from 'rxjs';
import { RxFor } from '@rx-angular/template/for';
import { RxState } from '@rx-angular/state';
import { RxActionFactory } from '@rx-angular/state/actions';
import { RxEffects } from '@rx-angular/state/effects';

type HeroesActions = {
  delete: Hero;
  add: string;
};

@Component({
  standalone: true,
  selector: 'app-heroes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, NgForOf, RxFor],
  providers: [RxState, RxActionFactory, RxEffects],
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent {
  actions = this.factory.create();

  heroes$ = this.state.select('heroes');

  constructor(
    private heroService: HeroService,
    private state: RxState<{ heroes: Hero[] }>,
    private factory: RxActionFactory<HeroesActions>,
    private effects: RxEffects
  ) {
    state.connect('heroes', this.heroService.getHeroes().pipe(startWith([])));

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

    this.effects.register(addEffect$);

    this.effects.register(deleteEffect$);
  }

  trackHero(_idx: number, hero: Hero) {
    return hero.id;
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
