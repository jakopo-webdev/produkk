import { Component, OnInit, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs';
import { CookieBannerComponent } from './core/components/cookie-banner';
import { FooterComponent } from './layout/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CookieBannerComponent, FooterComponent, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  showFooter = false;

  ngOnInit() {
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(() => {
      try { window.scrollTo({ top: 0, left: 0 }); } catch { window.scrollTo(0, 0); }
    });
    // Delay footer rendering by 300ms to avoid initial layout jump
    setTimeout(() => this.ngZone.run(() => {
      this.showFooter = true;
      this.cdr.detectChanges();
    }), 300);
  }
}
