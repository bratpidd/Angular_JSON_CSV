import { Component, OnInit } from '@angular/core';
import {ContentService} from '../content.service';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  inputForm;
  inputString: string;
  constructor(private contentService: ContentService,
              private formBuilder: FormBuilder,
              private router: Router) {
    this.inputForm = this.formBuilder.group({
      text: contentService.inputString
    });
  }

  ngOnInit(): void {
    this.inputString = this.contentService.inputString;
  }
  onSubmit(textarea): void {
     try {
      this.contentService.parseString(textarea.text);
      this.router.navigate(['edit']);
     } catch (e) {
      this.contentService.addAlert(e);
     }
  }
  loadExample(type: string): void {
    switch(type) {
      case 'JSON': this.inputString = '[{name:"Name 1",year:"2010"},{name:"Name 2",year:"1997"},{name:"Name 3",year:"2004"}]'; break;
      case 'CSV': this.inputString = '1,"Johnson, Smith, and Jones Co.",345.33,Pays on time\n' +
        '2,"Sam ""Mad Dog"" Smith",993.44,\n' +
        '3,"Barney & Company",0,"Great to work with\n' +
        'and always pays with cash."\n' +
        '4,Johnson\'s Automotive,2344,\n';
    }
  }

}
