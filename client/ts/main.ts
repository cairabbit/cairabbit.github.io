import * as styles from "../scss/main.scss";
const css: any = (styles as any).default;

import { JsonTranslator } from './core/i18n';

let i18n: JsonTranslator;
i18n = new JsonTranslator();

import * as $ from "jquery";
$(function () {
  $('*[data-toggle]').toggle();
});
