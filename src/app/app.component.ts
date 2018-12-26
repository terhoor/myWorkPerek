import { Component } from '@angular/core';
import { ApiService } from './shared/services/api.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  title = 'edadil';

  constructor(private apiService: ApiService) {
    this.apiService.generateInstanceId('152');
    this.apiService.signInDevice().subscribe(data => {
    });
  }
}


