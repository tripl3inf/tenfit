const path                 = require('path'),
      express              = require('express'),
      webpack              = require('webpack'),
      webpackMiddleware    = require('webpack-dev-middleware'),
      webpackHotMiddleware = require('webpack-hot-middleware'),
      config               = require('./webpack.config.js'),

      isDeveloping         = process.env.NODE_ENV !== 'production',
      // port                 = isDeveloping ? 3000 : process.env.PORT,
      port                 = 3000,
      app                  = express();

if (isDeveloping) {
    const compiler         = webpack(config);
    const middleware = webpackMiddleware(compiler, {
        publicPath : config.output.publicPath,
        contentBase: 'src',
        stats      : {
            colors      : true,
            hash        : false,
            timings     : true,
            chunks      : false,
            chunkModules: false,
            modules     : false
        }
    });

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));
    app.get('*', function response(req, res) {
        res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
        res.end();
    });
} else {
    app.use(express.static(__dirname + '/dist'));
    app.get('*', function response(req, res) {
        res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
}

app.listen(port, '0.0.0.0', function onStart(err) {
    if (err) {
        console.log(err);
    }
    console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});

