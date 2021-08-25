import { Component, Input, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AuthUser } from 'src/app/auth/auth-user.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  constructor(private socket: Socket) {}

  /*   msgChat: {
    room: number;
    nominativo: string;
    messaggio: string;
  }; */

  @Input() roomId: number;
  @Input() user: AuthUser;

  msg: string;
  element: HTMLElement;
  nome: string;
  nomeCheck: string;

  ngAfterViewChecked() {
    this.updateScroll();
  }

  ngOnInit() {
    this.nomeCheck = this.user.nomecognome;

    let messages = document.getElementById('messages');
    /*     form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (input.value) {
        this.socket.emit('chat message', input.value);
        input.value = '';
      }
    }); */

    this.socket.on('chat message_' + this.roomId, (msg) => {
      var textHead = document.createElement('li');
      let date = new Date();
      this.nome = msg.nominativo;

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

      if (this.nomeCheck == msg.nominativo) {
        textHead.style.cssText =
          'font-size: 8px; margin-bottom:-18px; color:#aeaeae; text-transform:uppercase; text-align: right;';
      } else {
        textHead.style.cssText =
          'font-size: 8px; margin-bottom:-18px; color:#aeaeae; text-transform:uppercase;';
      }
      var item = document.createElement('li');

      if (this.nomeCheck == msg.nominativo) {
        item.style.cssText =
          'text-align: right; color:#03477e; margin: 20px 8px; padding:3px;border-bottom-style: groove;border-color: #aeaeae;border-bottom-width: 2px; font-weight: 600;';
      } else {
        item.style.cssText =
          'margin: 20px 8px; padding:3px;border-bottom-style: groove;border-color: #aeaeae;border-bottom-width: 2px; font-weight: 600;';
      }

      item.textContent = msg.messaggio;

      messages.appendChild(textHead);
      messages.appendChild(item);
      //window.scrollTo(0, document.body.scrollHeight);
    });
  }

  sendMsg() {
    this.socket.emit('chat message', {
      room: this.roomId,
      nominativo: this.user.nomecognome,
      messaggio: this.msg,
    });
    this.msg = '';
  }

  updateScroll() {
    this.element = document.getElementById('msgArea');
    this.element.scrollTop = this.element.scrollHeight;
  }
}
