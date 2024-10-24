const router = require("express").Router();
const { readdirSync } = require('fs-extra');
const path = require('path');
const log = require('./log');
const compression = require('compression');

const srcPath = path.join(__dirname, "../scraper/");
router.use(compression());

const apiCache = new Map();

const loadApiModules = (directory) => {
  const apiFiles = readdirSync(directory).filter(file => file.endsWith(".js"));
  apiFiles.forEach(file => {
    const filePath = path.join(directory, file);
    const api = require(filePath);
    if (api.config && api.initialize) {
      apiCache.set(api.config.name, api);
      log.main(`Successfully loaded ${api.config.name}`);
    }
  });
};

loadApiModules(srcPath);

apiCache.forEach((api, name) => {
  const routePath = `/api/${name}`;
  
  router.get(routePath, async (req, res) => {
    try {
      await api.initialize({ req, res, log });
    } catch (error) {
      console.error(`Error in ${name} API:`, error);
      res.status(500).send("An error occurred");
    }
  });

  if (global.api instanceof Map) {
    global.api.set(name, api);
  } else {
    console.warn("global.api is not a Map. Skipping setting API in global scope.");
  }
});

const apiCount = apiCache.size;
log.main(`Successfully loaded ${apiCount} API${apiCount !== 1 ? 's' : ''}`);

module.exports = router;
