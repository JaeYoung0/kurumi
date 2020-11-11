const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true'
})


module.exports = withBundleAnalyzer({
    webpack(config, {webpack, isServer, dev}){
        const prod = process.env.NODE_ENV === 'production'
        const plugins = [
            ...config.plugins,
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/,/^\.\/ko$/)
        ]
        
        if (isServer) {
            // require('./scripts/sitemap-static')
            // require('./scripts/sitemap-posts')
            // require('./scripts/compress')
            require('./scripts/sitemap-all')
        }

        return {
            ...config,
            mode: prod ? 'production' : 'development',
            devtool: prod ? 'hidden-source-map' : "eval",
            plugins,
            node:{
                fs:"empty"
            }
        }
    },
    compress: true
})