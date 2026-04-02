/**
 * App bundle — custom Drilleedo JS
 * vendor.js (built by bin/build-vendors.js) is loaded before this and
 * exposes jQuery globally, so we treat it as an external.
 */

// Custom scripts (vanilla JS or jQuery-dependent)
// CSS is served directly via <link> tags in base.html.twig (avoids webpack url() resolution issues)
import '../../public/assets/drilleedo/js/main.js';
import '../../public/assets/drilleedo/js/category-selector.js';
import '../../public/assets/drilleedo/js/confirm-modal.js';
