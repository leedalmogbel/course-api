// dependencies
const fs = require('fs');
const md5 = require('md5');
const path = require('path');

// config
const paths = require('@config/paths');
const settings = require('@config/settings');

/**
 * Helper class for global components
 */
class Helper {
  /**
   * Process Files
   *
   * @param {Object} files
   * @return {Object} processed files
   */
  processFiles(files) {
    let processedFiles = {};

    // go through each files
    Object.entries(files).forEach(([name, file], index) => {

      // get temp path
      let tempPath = file.path;

      // generate new filename
      let filename = md5(Date.now() * Date.now());
      // get the extension
      let extension = path.extname(tempPath);

      // build new path
      let newPath = `${paths.upload}/${filename}${extension}`;

      // move the file
      fs.renameSync(tempPath, newPath);

      // now set the company image
      processedFiles[name] = {
        path: `${settings.upload_link}${filename}${extension}`,
        name: file.name
      }
    })

    return processedFiles;
  }
}

module.exports = Helper;