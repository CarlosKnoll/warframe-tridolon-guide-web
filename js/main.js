// main.js — page entry point. Import and initialize each component here.

import { initCycleWidget } from "./cycleWidget.js";
import { initTocWidget } from './tocWidget.js';
import { initLightbox } from './lightbox.js';

document.addEventListener("DOMContentLoaded", () => {
  initCycleWidget("#cycle-widget");
  initTocWidget();
  initLightbox();
});
