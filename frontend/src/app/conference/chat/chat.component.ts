import { Component, Input, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  constructor(private socket: Socket) {}

  msgChat: {
    room: number;
    nome: string;
    cognome: string;
    messaggio: string;
  };

  @Input() roomId: number;

  msg: string;
  element: HTMLElement;
  nome: string;

  ngAfterViewChecked() {
    this.updateScroll();
  }

  ngOnInit() {
    let messages = document.getElementById('messages');
    /*     form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (input.value) {
        this.socket.emit('chat message', input.value);
        input.value = '';
      }
    }); */

    this.socket.on('chat message_' + '1187', function (msg) {
      var textHead = document.createElement('li');
      let date = new Date();
      this.nome = msg.nome + ' ' + msg.cognome;

      textHead.textContent =
        this.nome +
        ' - ' +
        date.getDate().toString() +
        '/' +
        date.getMonth().toString() +
        ' - ' +
        date.getHours().toString() +
        ':' +
        date.getMinutes().toString();

      textHead.style.cssText =
        'font-size: 8px; margin-bottom:-18px; color:#aeaeae; text-transform:uppercase; text-align: right;';

      var item = document.createElement('li');

      item.style.cssText =
        'margin: 20px 8px; padding:3px;border-bottom-style: groove;border-color: #aeaeae;border-bottom-width: 2px; font-weight: 600;';

      item.textContent = msg.messaggio;

      messages.appendChild(textHead);
      messages.appendChild(item);
      //window.scrollTo(0, document.body.scrollHeight);
    });
  }

  sendMsg() {
    this.msgChat.room = this.roomId;
    this.msgChat.nome = 'Daniele';
    this.msgChat.cognome = 'Bambini';
    this.msgChat.messaggio = this.msg;

    this.socket.emit('chat message', this.msgChat);
    this.msg = '';
  }

  updateScroll() {
    this.element = document.getElementById('msgArea');
    this.element.scrollTop = this.element.scrollHeight;
  }
}
