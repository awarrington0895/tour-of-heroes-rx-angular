import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  standalone: true,
  selector: 'app-messages',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgForOf, NgIf, AsyncPipe],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent {
  constructor(public messageService: MessageService) {}
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
