const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
    mode: "development",
    entry: {
        'react-class-component': './src/react-class-component.jsx',
        'vue2-component': './src/vue2-component.vue',
    },
    performance: {
        hints: false,
    },
    output: {
        filename: '[name].bundle.js',
        path: __dirname + '/docs'
    },
    devServer: {
        static: './docs',
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
            },
            {
                test: /\.js?x$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        targets: {
                                            node: 'current'
                                        }
                                    }
                                ],
                                "@babel/react"
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.scss/,
                oneOf: [
                    // vue の style を解釈
                    {
                        resourceQuery: /vue/,
                        use: [
                            "vue-style-loader",
                            "css-loader",
                            {
                                loader: "sass-loader",
                                options: {
                                    sourceMap: true
                                }
                            },
                        ],
                    },
                    // react の style を解釈
                    {
                        use: [
                            "style-loader",
                            {
                                loader: "css-loader",
                                options: {
                                    url: false,
                                    modules: true
                                }
                            },
                            {
                                loader: "sass-loader",
                                options: {
                                    sourceMap: true
                                }
                            },
                        ]
                    }
                ],
            },
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ],
    resolve: {
        extensions: [".vue", ".js"],
        alias: {
            "vue$": "vue/dist/vue.esm.js"
        }
    },
    target: ["web"],
};