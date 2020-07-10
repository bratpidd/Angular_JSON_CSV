import { Component, OnInit } from '@angular/core';
import {ContentService} from '../content.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  data;
  keys = [];
  outputString = '';
  outFormat;
  constructor(private contentService: ContentService,
              private router: Router) {
    this.data = this.contentService.data;
    const keysRow = this.data[0]; // assuming keys in each row are the same
   // alert (JSON.stringify(this.data));
    Object.keys(keysRow).forEach(key => {
      this.keys.push(key);
    });
  }
  moveUp(i): void {
    if (i > 0) {
      [this.data[i], this.data[i-1]] = [this.data[i-1], this.data[i]];
    }
  }
  moveDown(i): void {
    if (i < this.data.length-1) {
      [this.data[i+1], this.data[i]] = [this.data[i], this.data[i+1]];
    }
  }
  addRow(i): void {
    const newRow = {};
    this.keys.forEach(key => {
      newRow[key] = '';
    });
    this.data.splice(i, 0, newRow);
  }
  deleteRow(i): void {
    this.data.splice(i, 1);
  }
  processData(type: string): void {
    this.contentService.setData(this.data);
    switch (type) {
      case 'JSON': this.outputString = this.contentService.getOutputJSONString(); this.outFormat = 'JSON'; break;
      case 'CSV': this.outputString = this.contentService.getOutputCSVString(); this.outFormat = 'CSV'; break;
      default: this.outputString = 'Format not specified';
    }
  }
  goBack(){
    this.router.navigate(['input']);
  }
  ngOnInit(): void {
  }

}
