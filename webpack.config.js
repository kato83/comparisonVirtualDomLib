module.exports = {
    mode: "production",
    entry: [
        './src/react-class-component.jsx',
    ],
    performance: {
        hints: false,
    },
    output: {
        filename: '[name].bundle.js',
        path: __dirname + '/dist'
    },
    devServer: {
        static: './dist',
    },
    module: {
        rules: [
            {
                test: /\.js?x$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "@babel/preset-env",
                                "@babel/react"
                            ]
                        }
                    }
                ]
            }
        ]
    },
    target: ["web"],
};