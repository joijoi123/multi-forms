/* eslint-disable prefer-destructuring */
import { spaForm } from '$utils/spanatural';
try {
  window.Webflow ||= [];
  window.Webflow.push(() => {
    spaForm();
  });
} catch (error) {}