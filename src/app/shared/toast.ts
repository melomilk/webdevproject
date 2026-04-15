import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  message: string = '';
  visible: boolean = false;

  show(msg: string) {
    this.message = msg;
    this.visible = true;

    setTimeout(() => {
      this.visible = false;
    }, 2000);
  }
}