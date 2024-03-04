import { AsyncPipe, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Observable } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { RxActionFactory } from '@rx-angular/state/actions';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

type UiActions = {
  searchInput: string;
};

@Component({
  standalone: true,
  selector: 'app-hero-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, AsyncPipe, NgForOf],
  providers: [RxActionFactory],
  styleUrls: ['./hero-search.component.css'],
  template: `
  <div id="search-component">
    <label for="search-box">Hero Search</label>
    <input #searchBox id="search-box" (input)="ui.searchInput($event)" />

    <ul class="search-result">
      <li *ngFor="let hero of heroes$ | async">
        <a routerLink="/detail/{{ hero.id }}">
          {{ hero.name }}
        </a>
      </li>
    </ul>
  </div>
  `
})
export class HeroSearchComponent {
  ui = this.factory.create({
    searchInput: (e: Event) => (e.target as HTMLInputElement).value,
  });

  heroes$: Observable<Hero[]> = this.ui.searchInput$.pipe(
    // wait 300ms after each keystroke before considering the term
    debounceTime(300),

    // ignore new term if same as previous term
    distinctUntilChanged(),

    // switch to new search observable each time the term changes
    switchMap((term: string) => this.heroService.searchHeroes(term))
  );

  constructor(
    private readonly heroService: HeroService,
    private readonly factory: RxActionFactory<UiActions>
  ) {}
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
