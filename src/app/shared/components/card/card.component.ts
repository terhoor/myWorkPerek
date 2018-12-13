import { Component, OnInit, OnDestroy } from '@angular/core';
import { OtherDataService } from '../../services/other-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit, OnDestroy {
  numberCard: string;
  sub$: Subscription;
  constructor(private otherDataService: OtherDataService) { }

  ngOnInit() {
    this.sub$ = this.otherDataService.numberCard.subscribe(card => this.numberCard = card);
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
  }

}
