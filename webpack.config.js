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
            },
            {
                test: /\.css/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            url: false,
                            modules: true
                        }
                    }
                ]
            }
        ]
    },
    target: ["web"],
};