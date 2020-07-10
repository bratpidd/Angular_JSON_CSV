import { Injectable } from '@angular/core';
import {throwError} from 'rxjs';
import {catchError, isEmpty, map, tap} from 'rxjs/operators';
declare var require: any;
const JSON5 = require('json5');
@Injectable({
  providedIn: 'root'
})
export class ContentService {
  inputString = '[{name:"Name 1",year:"2010"},{name:"Name 2",year:"1997"},{name:"Name 3",year:"2004"}]'; // JSON string
  data;

  constructor() {
    this.data = JSON5.parse(this.inputString);
  }
  isEmptyObj(obj) {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  }
  stripQuotes(str: string): string {
    const l = str.length;
    if (l>1){
      if ((str[0] === '"') && (str.endsWith('"'))){
        return str.substring(1, l-1);
      } else {return str; }
    } else {return str; }
  }
  addQuotes(str: any): string {
    if (typeof str === 'string') {
      return '"'+str+'"';
    } else {return str; };
  }
  setString(inputString: string) {
    this.inputString = inputString;
    this.data= [];
    let isCSV = false;
    if (inputString.indexOf('\n') !== -1) {
      isCSV = true;
     // alert('CSV');
      const inArray = [];
      let quoteCounter = 0;
      let currentRow = [];
      let currentValue = '';
      [...inputString].forEach((c, i) => {
        let skip = false;
        if (c === '"') {quoteCounter++; }
        if ((c === ',') && (quoteCounter % 2 === 0)) {
          currentRow.push(this.stripQuotes(currentValue));
          // alert(currentValue);
          currentValue = '';
          skip = true;
        }
        if (((c === '\n') || i+1 === inputString.length) && (quoteCounter %2 === 0)) {
          currentRow.push(this.stripQuotes(currentValue));
          inArray.push(currentRow);
         // alert(JSON.stringify(currentRow));
          currentRow = [];
          currentValue = '';
          skip = true;
        }
        if (!skip) {currentValue += c; }
      });
     // alert(JSON.stringify(inArray));
      if (inArray.length < 1) {
        throw new Error('Invalid CSV Data');
      }
      const keys = inArray[0];
      inArray.splice(0, 1);
     // alert(JSON.stringify(keys));
      if (inArray.length === 0) {
        const el = {};
        [...keys].forEach(key => {
          el[key] = '';
        });
        this.data.push(el);
      } else {
        inArray.forEach(row => {
          const rowObject = {};
          row.forEach((elem, i) => {
            rowObject[keys[i]] = elem;
          });
          this.data.push(rowObject);
        });
      }
    }
    if (!isCSV){
      this.data = JSON5.parse(this.inputString);
      if (this.data.length === 0) {throw new Error('JSON5 Error: zero length Array'); }
      if (this.isEmptyObj(this.data)) {throw new Error('JSON5 Error: object is empty'); }
      if ((typeof this.data === 'object') && !Array.isArray(this.data)) {
        this.data = [this.data];
      }
    }
  }
  setData(data): void {
    this.data = data;
  }
  getOutputJSONString(): string {
    return JSON5.stringify(this.data);
  }
  getOutputCSVString(): string {
    const keysRow = this.data[0];
    const keys = [];
    Object.keys(keysRow).forEach(key => {
      keys.push(key);
    });
    let stringOut = '';
    keys.forEach(key => {
      stringOut += this.addQuotes(key)+',';
    });
    stringOut = stringOut.slice(0, -1)+'\n';
    this.data.forEach((dataRow, i) => {
      keys.forEach((key, j) => {
        stringOut += this.addQuotes(dataRow[key]);
        if (j+1 !== keys.length) {
          stringOut += ',';
        } else {
          stringOut += '\n';
        }
      });
    });
    return stringOut;
  }
}
