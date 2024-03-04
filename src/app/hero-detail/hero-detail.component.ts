import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe, Location, NgIf, UpperCasePipe } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { FormsModule } from '@angular/forms';
import { RxActionFactory } from '@rx-angular/state/actions';
import { rxEffects } from '@rx-angular/state/effects';
import { rxState } from '@rx-angular/state';
import { RxPush } from '@rx-angular/template/push';
import {
  of,
  defer,
  map,
  switchMap,
  mergeMap,
  withLatestFrom,
  merge,
  shareReplay,
} from 'rxjs';

type DetailActions = {
  save: void;
  goBack: void;
  nameUpdated: string;
};

@Component({
  standalone: true,
  selector: 'app-hero-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, FormsModule, UpperCasePipe, RouterLink, AsyncPipe, RxPush],
  providers: [RxActionFactory],
  styleUrls: ['./hero-detail.component.css'],
  template: `
  <div *ngIf="hero$ | async as hero">
    <h2>{{ hero.name | uppercase }} Details</h2>
    <div><span>id: </span>{{ hero.id }}</div>
    <div>
      <label for="hero-name">Hero name: </label>
      <input
        id="hero-name"
        [value]="name$ | push"
        (input)="actions.nameUpdated($event)"
        placeholder="Hero name"
      />
    </div>
    <button type="button" (click)="actions.goBack()">go back</button>
    <button type="button" (click)="actions.save()">save</button>
  </div>
  `
})
export class HeroDetailComponent {
  hero$ = defer(() => of(this.route.snapshot.paramMap.get('id')!)).pipe(
    map((id) => parseInt(id, 10)),
    switchMap((id) => this.heroService.getHero(id)),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  actions = this.factory.create({
    nameUpdated: (e: Event) => (e.target as HTMLInputElement).value,
  });

  private state = rxState<{ updatedHero: Hero }>(({ connect }) => {
    connect(this.hero$.pipe(map((hero) => ({ updatedHero: hero }))));

    connect(
      'updatedHero',
      this.actions.nameUpdated$,
      (state, name) => ({
        ...state.updatedHero,
        name,
      })
    );
  });

  private effects = rxEffects(({ register }) => {
    const saveEffect$ = this.actions.save$.pipe(
      withLatestFrom(this.state.$),
      mergeMap(([, state]) => this.heroService.updateHero(state.updatedHero))
    );

    const backEffect$ = merge(this.actions.goBack$, saveEffect$);

    register(backEffect$, () => this.location.back());
  });

  name$ = this.state.select('updatedHero', 'name');

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location,
    private factory: RxActionFactory<DetailActions>
  ) {
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
