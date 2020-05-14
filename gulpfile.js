'use strict';

const
    SRC_CODE      = [ './app/**/*.js', './server.js' ],
    TEST_SRC_CODE = [ 'test/unit/**/test-*.js' ],
    COVERAGE_PATH = process.env.CIRCLE_TEST_REPORTS || './coverage',
    CODACY_TOKEN  = '7cb1f279c33d47499b5905c0d4fceac1',

    /* PACKAGE DEPENDENCIES */
    gulp          = require('gulp'),
    del           = require('del'),
    eslint        = require('gulp-eslint'),
    mocha         = require('gulp-mocha'),
    istanbul      = require('gulp-istanbul'),
    codacy        = require('gulp-codacy'),

    /* CONFIG */
    eslint_conf   = require('./.eslintrc');

/* GROUP TASKS */
gulp.task('default', [ 'all' ]);
gulp.task('test',    [ 'test:unit', 'eslint' ]);
gulp.task('all',     [ 'clean', 'test' ]);

/* TEST
     - Run unit tests with Karma & Mocha, generationg it with Istanbul */
gulp.task('test:unit', () => {

    /* Instrumenting with istanbul */
    return gulp.src(SRC_CODE)
        .pipe(istanbul({
            'includeUntested': true
        }))

        .pipe(istanbul.hookRequire())

        .on('finish', () => {

            /* MOCHA COVERING */
            gulp.src(TEST_SRC_CODE)
            .pipe(mocha({
                'reporter': 'mocha-junit-reporter',
                'reporterOptions': {
                    'mochaFile': COVERAGE_PATH + '/junit/results.xml'
                },
                'timeout' : 200
            }))

            /* WRITING REPORTS - https://github.com/SBoudrias/gulp-istanbul */
            .pipe(istanbul.writeReports({
                'reporters'  : ['text', 'text-summary', 'html', 'lcov', 'json', 'cobertura' ],
                'reportOpts' : { 'dir': COVERAGE_PATH}
            }));
        });
});

/* ESLint
     - rules: http://eslint.org/docs/rules */
gulp.task('eslint', () => {
    return gulp.src(SRC_CODE)

        // Config
        .pipe(eslint(eslint_conf))

        // Format
        .pipe(eslint.format())

        // Error Handling
        .pipe(eslint.failAfterError());
});

/* CLEAN */
gulp.task('clean', (cb) => {
    del([ 'coverage', 'dist' ], cb);
});

gulp.task('codacy', () => {
    return gulp
        .src([ `${COVERAGE_PATH}/lcov.info` ], { 'read': false })
        .pipe(codacy({ 'token': CODACY_TOKEN }));
});
