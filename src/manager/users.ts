import { generateRandomNum } from '../utils/number';
import { Op } from 'sequelize';
import sha1 from 'crypto-js/sha1';
import SequelizeDb from '../sequelize';
import Config from '../lib/config';
import AppLogger from '../lib/log/logger';
import { CreatedUserInfo } from './interface';

const FiveMinutes = 1000 * 60 * 5;
export default class UserManager {
  private sequelizeDb: SequelizeDb;
  private config: Config;
  private appLog: AppLogger;
  
  public constructor(sequelizeDb: SequelizeDb, config: Config, appLog: AppLogger) {
    this.sequelizeDb = sequelizeDb;
    this.config = config;
    this.appLog = appLog;
  }

  async findUserByPhone(phone: string) {
    const user = await this.sequelizeDb.User.findOne({
      where: {
        phone,
      },
    });

    if (!user) {
      return null;
    }

    return user.toJSON();
  }

  async findUserByUsername(username: string) {
    const user = await this.sequelizeDb.User.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      return null;
    }

    return user.toJSON();
  }

  async createUser(userInfo: CreatedUserInfo) {
    const { hashPassword } = userInfo;
    const newHashPassword = sha1(hashPassword).toString();

    const newUser = await this.sequelizeDb.User.create({
      ...userInfo,
      hashPassword: newHashPassword,
    });

    return newUser.toJSON();
  }
}
