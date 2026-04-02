#!/usr/bin/env node
/**
 * Concatenate pre-minified vendor JS and CSS into single bundles.
 * Output: public/build/vendor.js, public/build/vendor.css
 * Run before Webpack Encore: npm run build-vendors
 */

const fs   = require('fs');
const path = require('path');

const ROOT   = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public/assets/drilleedo');
const OUT    = path.join(ROOT, 'public/build');

// Vendor JS files — ORDER MATTERS (jQuery must come before plugins)
const JS_FILES = [
    'js/vendor/modernizr.min.js',
    'js/vendor/jquery.js',
    'js/vendor/bootstrap.min.js',
    'js/vendor/sal.js',
    'js/vendor/js.cookie.js',
    'js/vendor/jquery.style.switcher.js',
    'js/vendor/swiper.js',
    'js/vendor/jquery-appear.js',
    'js/vendor/odometer.js',
    'js/vendor/backtotop.js',
    'js/vendor/isotop.js',
    'js/vendor/imageloaded.js',
    'js/vendor/wow.js',
    'js/vendor/waypoint.min.js',
    'js/vendor/easypie.js',
    'js/vendor/text-type.js',
    'js/vendor/jquery-one-page-nav.js',
    'js/vendor/bootstrap-select.min.js',
    'js/vendor/jquery-ui.js',
    'js/vendor/magnify-popup.min.js',
    'js/vendor/paralax-scroll.js',
    'js/vendor/paralax.min.js',
    'js/vendor/countdown.js',
    'js/vendor/plyr.js',
    'js/vendor/jodit.min.js',
    'js/vendor/Sortable.min.js',
];

// Vendor CSS files — order matters (bootstrap first)
const CSS_FILES = [
    'css/vendor/bootstrap.min.css',
    'css/vendor/slick.css',
    'css/vendor/slick-theme.css',
    'css/plugins/sal.css',
    'css/plugins/feather.css',
    'css/plugins/fontawesome.min.css',
    'css/plugins/euclid-circulara.css',
    'css/plugins/dm-serif-display.css',
    'css/plugins/swiper.css',
    'css/plugins/odometer.css',
    'css/plugins/animation.css',
    'css/plugins/bootstrap-select.min.css',
    'css/plugins/jquery-ui.css',
    'css/plugins/magnigy-popup.min.css',
    'css/plugins/plyr.css',
    'css/plugins/jodit.min.css',
];

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

function concat(files, srcBase, outFile) {
    let parts = [];
    let missing = [];

    for (const rel of files) {
        const full = path.join(srcBase, rel);
        if (!fs.existsSync(full)) { missing.push(rel); continue; }
        parts.push(`/* --- ${rel} --- */\n` + fs.readFileSync(full, 'utf8'));
    }

    if (missing.length) {
        console.warn('⚠  Missing vendor files (skipped):\n  ' + missing.join('\n  '));
    }

    const dest = path.join(OUT, outFile);
    fs.writeFileSync(dest, parts.join('\n\n'));
    const kb = Math.round(fs.statSync(dest).size / 1024);
    console.log(`✓ ${outFile}  (${kb} KB, ${parts.length} files)`);
}

concat(JS_FILES,  PUBLIC, 'vendor.js');
concat(CSS_FILES, PUBLIC, 'vendor.css');

console.log('\n✅ Vendor bundles written to public/build/');
