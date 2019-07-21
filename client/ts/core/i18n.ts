import { ajax } from 'rxjs/ajax';
import * as Cookies from "js-cookie";

const localeUrl = '/locale';

export interface ITranslate {
  translate(val: string): string;
}

export class JsonTranslator implements ITranslate {
  constructor() {
    this.language = document.getElementsByTagName("html")[0].lang || '';
    this.locales = (<any>window).locale || {};
  }

  language: string;
  locales: { [key: string]: string; };

  translate(key: string): string {
    var val = this.locales[key];
    if (val) return val;
    const headers = {
      'content-type': 'text/plain',
      'x-xsrf-token': Cookies.get('x-xsrf-token')
    };
    ajax.put(localeUrl, key, headers).subscribe();
    val = "[" + key + "]";
    this.locales[key] = val;
    return val;
  }
}
