// main.js — page entry point. Import and initialize each component here.

import { initCycleWidget } from "./cycleWidget.js";
import { initTocWidget } from './tocWidget.js';
import { initLightbox } from './lightbox.js';
import { initSiteNav } from './siteNav.js';

document.addEventListener("DOMContentLoaded", () => {
  initSiteNav();
  initCycleWidget("#cycle-widget");
  initTocWidget();
  initLightbox();
});