import * as styles from "../scss/main.scss";
const css: any = (styles as any).default;


import * as $ from "jquery";
$(function () {
  $('*[data-toggle]').toggle();
});
