import { BehaviorSubject } from 'rxjs';



export class OtherDataService {
  phoneNumber: BehaviorSubject<string> = new BehaviorSubject('');

  constructor() {

  }


}