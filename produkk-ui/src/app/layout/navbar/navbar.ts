import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  auth = inject(AuthService);
}
