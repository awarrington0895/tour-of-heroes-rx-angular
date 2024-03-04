import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  standalone: true,
  selector: 'app-messages',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgForOf, NgIf, AsyncPipe],
  styleUrls: ['./messages.component.css'],
  template: `
  @if (messageService.messages$ | async; as messages) {
    <div>
      <h2>Messages</h2>
      <button type="button" class="clear" (click)="messageService.clear()">
        Clear messages
      </button>

      @for (message of messages; track $index) {
        <div>{{message}}</div>
      }
    </div>
  }
  `
})
export class MessagesComponent {
  messageService = inject(MessageService);
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
