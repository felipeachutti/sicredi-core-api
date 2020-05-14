'use strict';

// Getting Launcher
const launcher = require('./app/launcher');

// Getting Engine options by environment
const options = launcher.configure(process.env.sicredi_ENGINE);

// Set Configuration
launcher.bootstrap(options);

// Starting application
launcher.run();
