import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cookie-banner.html',
})
export class CookieBannerComponent {
  show = localStorage.getItem('produkk_cookie_ack') !== '1';

  close() {
    localStorage.setItem('produkk_cookie_ack', '1');
    this.show = false;
  }
}
