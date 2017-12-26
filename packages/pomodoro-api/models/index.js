import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
import database from '../config/database'

const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = database[env]
const db = {}

const initSequelize = () => {
  if (config.use_env_variable) {
    return new Sequelize(process.env[config.use_env_variable], config)
  }

  return new Sequelize(config.database, config.username, config.password, config)
}

const sequelize = initSequelize()

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0)
    && (file !== basename)
    && (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db)
  .forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  })

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
