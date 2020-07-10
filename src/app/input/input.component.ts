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
      this.contentService.setString(textarea.text);
      this.router.navigate(['edit']);
    } catch (e) {
      alert(e);
    }
  }

}
