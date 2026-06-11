import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CookieBannerComponent } from './core/components/cookie-banner';
import { FooterComponent } from './layout/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CookieBannerComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
