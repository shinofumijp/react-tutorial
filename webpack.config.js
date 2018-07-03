module.exports  = {
  mode: 'development',
  entry: './main.js',
  output: {
    filename: 'index.js',
    path: `${__dirname}/src`,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                ['env', {'module': false}],
                'react'
              ]
            }
          },
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader?modules'
          },
        ]
      }
    ]
  }
}
