import { Component } from '@angular/core';
import { ApiService } from './shared/services/api.service';
import { OtherDataService } from './shared/services/other-data.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  title = 'edadil';

  constructor() {}
}


