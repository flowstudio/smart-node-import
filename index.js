const Module = require('module');
const fs = require('fs');
const _require = Module.prototype.require;

let requireRootPath = null;
let requireCacheFile = null;
let requireCache = null;

const smartRequire = function(name) {
	// allow root require
	if (name.indexOf('@/') === 0) {
		name = requireRootPath + name.substr(1);
	}

	if (!requireCache) {
		return _require.call(this, name);
	}
	
	const isRelative = name[0] === '/' || name.substr(0, 2) === './' || name.substr(0, 3) === '../';
	
	let pathToLoad;
	let currentModuleCache = requireCache[isRelative ? this.filename : '~'];
	
	if (!currentModuleCache) {
		currentModuleCache = {};
		requireCache[isRelative ? this.filename : '~'] = currentModuleCache;
	}
	
	if (currentModuleCache[name]) {
		pathToLoad = currentModuleCache[name];
	} else {
		pathToLoad = Module._resolveFilename(name, this);
		currentModuleCache[name] = pathToLoad;
	}
	
	return _require.call(this, pathToLoad);
};

const save = function(kill) {
	try {
		fs.writeFileSync(requireCacheFile, JSON.stringify(requireCache), 'utf-8');
	} catch (err) {
		console.error('Failed to save require cache: ' + err.toString());
	}
	
	kill === true && process.exit(2);
};

module.exports = function(root, cacheDir) {
	if (cacheDir) {
		requireCacheFile = cacheDir + '/smart-node-import.json';
		requireCache = fs.existsSync(requireCacheFile) ? JSON.parse(fs.readFileSync(requireCacheFile, 'utf-8')) : {};

		process.once('exit', save);
		process.once('SIGINT', save.bind(save, true));
	}

	requireRootPath = root;

	Module.prototype.require = smartRequire;
};