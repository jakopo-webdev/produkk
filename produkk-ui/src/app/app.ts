import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { CookieBannerComponent } from './core/components/cookie-banner';
import { FooterComponent } from './layout/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CookieBannerComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private router = inject(Router);

  ngOnInit() {
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(() => {
      try { window.scrollTo({ top: 0, left: 0 }); } catch { window.scrollTo(0, 0); }
    });
  }
}
