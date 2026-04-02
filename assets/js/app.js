/**
 * App bundle — custom Drilleedo JS
 * vendor.js (built by bin/build-vendors.js) is loaded before this and
 * exposes jQuery globally, so we treat it as an external.
 */

// Import custom CSS (processed by Webpack, versioned in production)
import '../css/app.css';

// Custom scripts (vanilla JS or jQuery-dependent)
// Imported as side-effect modules — they register event listeners on DOMContentLoaded
import '../../public/assets/drilleedo/js/main.js';
import '../../public/assets/drilleedo/js/category-selector.js';
import '../../public/assets/drilleedo/js/confirm-modal.js';
