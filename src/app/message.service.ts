import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private state = new RxState<{ messages: string[] }>();

  messages$: Observable<string[]> = this.state.select('messages');

  constructor() {
    this.state.set({ messages: [] });
  }

  add(message: string) {
    this.state.set('messages', (s) => [...s.messages, message]);
  }

  clear() {
    this.state.set({ messages: [] });
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
