import User from './user.js';
import Task from './task.js';
import sequelize from '../services/db.js';

User.hasMany(Task, { foreignKey: 'userId', as: 'user' });

export { sequelize, User, Task };
export default { sequelize, User, Task };