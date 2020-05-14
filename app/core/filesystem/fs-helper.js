'use strict';

const fs = require('fs');

exports.folderAssurance = function(dir) {
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir);
};

// Check file exist in drive
exports.fileExist = function(file, cb) {
    fs.stat(file, function(err) {

        if (err) return cb(err);
        return cb(null);
    });
};

exports.rename = function(oldPath, newPath, cb) {
    fs.rename(oldPath, newPath, cb);
};

exports.delete = function(path, cb) {
    fs.unlink(path, cb);
};

exports.saveFile = function(originalPath, customer_id, file, cb) {

    fs.readFile(originalPath, function(err, filebytes) {

        if (err) { return cb(err); }

        fs.writeFile(global.config.drive.root_path.toString() + customer_id + '/' + file.originalFilename, filebytes, (err) => {

            if (err) { return cb(err); }

            file.path = global.config.drive.root_path.toString() + customer_id + '/' + file.originalFilename;

            return cb(null, file);

        });

    });
};

exports.saveFileFromString = function(fileContent, filePath, fileName, customer_id, cb) {

    exports.folderAssurance(filePath);

    fs.writeFile(filePath + '/' + fileName, fileContent, (err, filebytes) => {

        if (err) { return cb(err); }

        return cb(null, filebytes);

    });

};

exports.savePublicFile = function(originalPath, customer_id, file, cb) {

    fs.readFile(originalPath, function(err, filebytes) {

        if (err) { return cb(err); }

        fs.writeFile(global.config.router.public_folder.toString() + customer_id + '/' + file.originalFilename, filebytes, (err) => {

            if (err) { return cb(err); }

            file.path = global.config.router.public_folder.toString() + customer_id + '/' + file.originalFilename;

            return cb(null, file);

        });

    });
};

exports.error = function(err, index) {
    const
        prefix =  new Date().getTime(),
        sufix  =  index || global.nodename || 'server.js',
        fname  = `${prefix}-${global.gcore_engine}-${sufix}.dump`;

    let data;

    // formatting data
    data = err.message + '\n';
    data += err.stack.toString();

    // preparing to dump
    const output = './logs/' + fname.replace(' ', '_');

    // writting details
    fs.writeFileSync(output, data);
};

exports.walk = function walk(path, sufix_pattern, cb) {

    fs.readdirSync(path).forEach(function(file) {
        const
            newPath = `${path}/${file}`,
            stat    = fs.statSync(newPath);

        let
            temp,
            targetFile;

        if (stat.isFile()) {

            // if it is a 'functional' module, it will try to apply loadParams to the module
            // case else, it was loaded already and you don't need to call.
            if (newPath.indexOf(sufix_pattern) !== -1) {
                targetFile = newPath.replace('//', '/');
                temp       = require(targetFile);

                cb(targetFile, temp);
            }

        // If it is a folder, need to look into it...
        } else if (stat.isDirectory()) {
            walk(newPath, sufix_pattern, cb);
        }
    });
};

exports.filePathToBase64 =  function filePathToBase64(path, cb) {
    let base64_data;

    fs.readFile(path, (err, data) => {
        if (err)
            return cb(err, null);
        base64_data = new Buffer(data).toString('base64');
        return cb(null, base64_data);
    });
};

module.exports = exports;