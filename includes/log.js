const moment = require('moment-timezone');
const kleur = require('kleur');

const getTime = () => moment().tz('Asia/Manila').format('HH:mm:ss');

const createLogger = (colorFn, prefix = '') => 
    (text) => console.log(kleur.bold(colorFn(`[${getTime()}] [ ZCDS PH ]${prefix} » ${text}`)));

const log = {
    main: createLogger(kleur.blue),
    hm: createLogger(kleur.blue),
    plain: (text) => console.log(kleur.bold(kleur.blue(text))),
    error: (text) => createLogger(kleur.red, ' [ Error ]')(text),
    warn: (text) => createLogger(kleur.yellow, ' [ Warn ]')(text)
};

module.exports = log;
