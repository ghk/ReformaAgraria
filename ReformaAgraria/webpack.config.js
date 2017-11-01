const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const AotPlugin = require('@ngtools/webpack').AotPlugin;
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (env) => {
    // Configuration in common to both client-side and server-side bundles    
    const isDevBuild = !(env && env.prod);
    const sharedConfig = {
        stats: { modules: false },
        context: __dirname,
        resolve: { extensions: [ '.js', '.ts' ] },
        output: {
            filename: '[name].js',
            publicPath: 'dist/' // Webpack dev middleware, if enabled, handles requests for this URL prefix
        },
        module: {
            rules: [
                //{ test: /\.ts$/, include: /ClientApp/, use: isDevBuild ? ['awesome-typescript-loader?silent=true', 'angular2-template-loader'] : ['@ngtools/webpack', 'angular2-template-loader'] },
                { test: /\.ts$/, include: /ClientApp/, use: ['awesome-typescript-loader?silent=true', 'angular2-template-loader'] },
                { test: /\.html$/, use: 'html-loader?minimize=false' },
                { test: /\.css$/, use: ['to-string-loader', isDevBuild ? 'css-loader' : 'css-loader?minimize'] },
                { test: /\.scss/, include: /ClientApp/, loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader!sass-loader'}) },
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' },
                { test: /\.(png|woff|woff2|eot|otf|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' }
            ]
        },
        plugins: [
            new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery', Popper: ['popper.js', 'default'] }),
            new webpack.DefinePlugin({ ENV: isDevBuild ? JSON.stringify('Development') : JSON.stringify('Production') }),
            new CheckerPlugin(),
            new ExtractTextPlugin('styles.css')
        ]
    };

    // Configuration for client-side bundle suitable for running in browsers
    const clientBundleOutputDir = './wwwroot/dist';
    const clientBundleConfig = merge(sharedConfig, {
        entry: { 'main-client': './ClientApp/boot.browser.ts' },
        output: { path: path.join(__dirname, clientBundleOutputDir) },
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/vendor-manifest.json')
            })
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })            
        ] : [
            // Plugins that apply in production builds only
            new webpack.optimize.UglifyJsPlugin()
            //new AotPlugin({
            //    tsConfigPath: './tsconfig.json',
            //    skipCodeGeneration: true,
            //    entryModule: path.join(__dirname, 'ClientApp/app/app.module.browser#AppModule'),
            //    exclude: ['./**/*.server.ts']
            //})
        ])
    });
    
    return [clientBundleConfig];
};
