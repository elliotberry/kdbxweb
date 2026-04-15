import * as path from 'path';
import * as fs from 'fs';
import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
const { BannerPlugin } = webpack;

const rootDir = process.cwd();
const pkg = JSON.parse(
    fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8').replace(/^\uFEFF/, '')
);

const debug = process.argv.indexOf('--mode=development') > 0;
const license = `opensource.org/licenses/${pkg.license}`;
const copyright = `(c) ${new Date().getFullYear()} ${pkg.author}, ${license}`;
const banner = `kdbxweb v${pkg.version}, ${copyright}`;

export default {
    context: path.join(rootDir, 'lib'),
    entry: './index.ts',
    output: {
        path: path.join(rootDir, 'dist'),
        filename: 'kdbxweb' + (debug ? '' : '.min') + '.js',
        library: 'kdbxweb',
        libraryTarget: 'umd',
        globalObject: 'this'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                        compilerOptions: {
                            ignoreDeprecations: '6.0'
                        },
                        configFile: path.join(
                            rootDir,
                            'conf',
                            `tsconfig.build-${debug ? 'debug' : 'prod'}.json`
                        )
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [path.join(rootDir, 'util'), path.join(rootDir, 'node_modules')],
        alias: {
            '@': rootDir
        },
        fallback: {
            console: false,
            process: false,
            Buffer: false,
            crypto: false,
            zlib: false
        }
    },
    plugins: [new BannerPlugin({ banner })],
    node: {
        __filename: false,
        __dirname: false
    },
    optimization: {
        minimize: !debug,
        minimizer: debug
            ? []
            : [
                  new TerserPlugin({
                      extractComments: false
                  })
              ]
    },
    externals: {
        fs: true,
        path: true,
        crypto: true,
        zlib: true,
        '@xmldom/xmldom': true
    },
    performance: {
        hints: false
    },
    stats: {
        builtAt: false,
        env: false,
        hash: false,
        colors: true,
        modules: true,
        reasons: true,
        children: true,
        warnings: false,
        errorDetails: false,
        errorStack: false,
        errorsCount: false,
        logging: false, // false, 'none' | 'error' | 'warn' | 'info' | 'log' | 'verbose'
        loggingTrace: false
    }
};
