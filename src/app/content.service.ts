import { Injectable } from '@angular/core';
import {throwError} from 'rxjs';
import {catchError, isEmpty, map, tap} from 'rxjs/operators';
declare var require: any;
const JSON5 = require('json5');
@Injectable({
  providedIn: 'root'
})
export class ContentService {
  recognizedEncoding = '';
  inputString = '';
  data;
  alerts: string[] = [];;
  constructor() {
    // this.data = JSON5.parse(this.inputString);
  }
  addAlert(alert: string) {
    this.alerts.splice(0, 0, alert);
  }
  clearAlerts() {
    this.alerts = [];
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
    if (isNaN(str)) {
      return '"'+str+'"';
    } else {return str; }
  }
  parseString(inputString: string) {
    const resJson = this.parseJson(inputString);
    if (resJson.data !== null) {
      this.data = resJson.data;
      this.inputString = inputString;
      this.recognizedEncoding = 'JSON';
    } else {
      const resCsv = this.parseCsv(inputString);
      if (resCsv.data !== null) {
        this.data = resCsv.data;
        this.inputString = inputString;
        this.recognizedEncoding = 'CSV';
      } else { // both methods returned an error
        throw new Error(resJson.error.message+'; '+resCsv.error.message);
      }
    }
  }
  parseJson(inputString: string) {
    try {
      const obj = JSON5.parse(inputString);
      if (!Array.isArray(obj)) {
        this.clearAlerts();
        this.addAlert(`${inputString}: Объект в JSON не является массивом. Строка была распознан как CSV`);
        throw new Error();
      }
      obj.forEach(item => {
        if (item === null) {
          this.clearAlerts();
          this.addAlert(`${inputString}: Массив в JSON содержит NULL. Строка была распознан как CSV` );
          throw new Error();
        }
      });
      this.clearAlerts();
      return {
        data: obj,
        error: null
      };
    } catch (e) {
      return {
        data: null,
        error: e
      };
    }
  }
  parseCsv(inputString: string) {
    try {
      const arr = [];
      const inArray = [];
      let quoteCounter = 0;
      let currentRow = [];
      let currentValue = '';
      [...inputString].forEach((c, i) => {
        let skip = false;
        if (c === '"') {quoteCounter++; }
        if ((c === ',') && (quoteCounter % 2 === 0)) {
          currentRow.push(this.stripQuotes(currentValue));
          currentValue = '';
          skip = true;
        }
        if (((c === '\n') || i+1 === inputString.length) && (quoteCounter %2 === 0)) {
          if ((i+1 === inputString.length) && (c!==',') && (c !== '\n')) {currentValue += c; }
          currentRow.push(this.stripQuotes(currentValue));
          inArray.push(currentRow);
          currentRow = [];
          currentValue = '';
          skip = true;
        }
        if (!skip) {currentValue += c; }
      });
      if (inArray.length < 1) {
        throw new Error('Ошибка CSV: некорректный ввод данных');
      }
      let maxRowLength = 0;
      inArray.forEach(row => {
        if (row.length > maxRowLength) {
          maxRowLength = row.length;
        }
      });
      const keys = inArray[0];
      inArray.splice(0, 1);
      if (inArray.length === 0) {
        const el = {};
        [...keys].forEach(key => {
          el[key] = '';
        });
        arr.push(el);
      } else {
        inArray.forEach(row => {
          const rowObject = {};
          for (let i = 0; i < maxRowLength; i++) {
            rowObject[keys[i]] = row[i] || '';
          }
          arr.push(rowObject);
        });
      }
      return {
        data: arr,
        error: null
      };
    } catch (e) {
      return {
        data: null,
        error: e
      };
    }
  }
  setData(data): void {
    this.data = data;
  }
  getOutputJSONString(): string {
    return JSON5.stringify(this.data);
  }
  getOutputCSVString(): string {
    // if (this.data.length === 0) {throw new Error('Ошибка CSV: в таблице нет')}
    const keysRow = this.data[0];
   // alert(JSON.stringify(this.data));
    const keys = [];
    Object.keys(keysRow).forEach(key => {
      keys.push(key);
    });
    let stringOut = '';
    keys.forEach(key => {
      stringOut += this.addQuotes(key)+',';
    });
    stringOut = stringOut.slice(0, -1)+'\n';
    let stringRow = '';
    let stringCache = '';
    let rowNotEmpty = false;
    this.data.slice().reverse().forEach((dataRow, i) => {
      keys.forEach((key, j) => {
        stringRow += this.addQuotes(dataRow[key]);
        rowNotEmpty = rowNotEmpty ? rowNotEmpty : ((dataRow[key] !== '') || (stringCache !== ''));
        if (j+1 !== keys.length) {
          stringRow += ',';
        } else {
          stringRow += '\n';
        }
      });
      if (rowNotEmpty) {
        stringCache = stringRow + stringCache;
      }
      // rowNotEmpty = false;
      stringRow = '';
    });
    return stringOut+stringCache;
  }
}
