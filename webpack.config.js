const Encore = require('@symfony/webpack-encore');

if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build')

    // ── Custom app bundle (JS + CSS) ──────────────────────────────────
    // vendor.js/vendor.css are built separately by bin/build-vendors.js
    .addEntry('app', './assets/js/app.js')

    .disableSingleRuntimeChunk()
    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())

    // Content-hashed filenames in production (cache-busting)
    .enableVersioning(Encore.isProduction())

    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = '3.38';
    })

    // jQuery is provided globally by vendor.js — not bundled by webpack
    .addExternals({
        jquery: 'jQuery',
    })
;

module.exports = Encore.getWebpackConfig();
