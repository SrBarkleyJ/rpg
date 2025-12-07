const combatCore = require('./combatCore');
const combatEnemy = require('./combatEnemy');
const combatDungeon = require('./combatDungeon');
const combatActions = require('./combatActions');

module.exports = {
    ...combatCore,
    ...combatEnemy,
    ...combatDungeon,
    ...combatActions
};
