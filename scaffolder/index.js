var path = require('path');
var dasherize = require('dasherize');
var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument("package", { type: String, required: true });
    this.argument("funcpath", { type: String, required: true });

    this._utilExt = '.ts';
    this._testExt = '.test.ts';
    this._titlePattern = /{{title}}/g;
    this._testTmpl = 'test.template';
    this._utilTmpl = 'util.template';
    this._pathParts = path.parse(this.options.funcpath);
  }

  _getRelativeDestPath (subdir) {
    return path.join(
      'packages', this.options.package, subdir, this._pathParts.dir)
  }

  _createFileFromTemplate (tmplName, ext, subdir) {
    const template = this.fs.read(this.templatePath(tmplName));
    const interpolated = template.replace(this._titlePattern, this._pathParts.name);
    const relativeDestPath = path.join(this._getRelativeDestPath(subdir), dasherize(this._pathParts.name) + ext);
    this.fs.write(
      this.destinationPath(relativeDestPath),
      interpolated
    );
  }

  createUtil () {
    const subdir = 'src';
    this._createFileFromTemplate(this._utilTmpl, this._utilExt, subdir);

    // update index file
    const indexFilePath = path.join(this._getRelativeDestPath(subdir), 'index.ts');
    const entry = `export * from "./${dasherize(this._pathParts.name)}";`

    if (this.fs.exists(indexFilePath)) {
      this.fs.append(indexFilePath, entry)
    } else {
      this.fs.write(indexFilePath, entry)
    }
    // No conflict resolution here. We know what we're doing.
    this.env.sharedFs.get(indexFilePath).conflicter = 'force';
  }

  createTest () {
    this._createFileFromTemplate(this._testTmpl, this._testExt, 'test');
  }
};