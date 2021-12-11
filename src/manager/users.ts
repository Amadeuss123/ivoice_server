import { generateRandomNum } from '../utils/number';
import { Op } from 'sequelize';
import sha1 from 'crypto-js/sha1';
import SequelizeDb from '../sequelize';
import Config from '../lib/config';
import AppLogger from '../lib/log/logger';
import { CreatedUserInfo } from './interface';

const FiveMinutes = 1000 * 60 * 5;
export default class UsersManager {
  private sequelizeDb: SequelizeDb;
  private config: Config;
  private appLog: AppLogger;
  
  public constructor(sequelizeDb: SequelizeDb, config: Config, appLog: AppLogger) {
    this.sequelizeDb = sequelizeDb;
    this.config = config;
    this.appLog = appLog;
  }

  async generateMessageCode(phone: string) {
    const code = String(generateRandomNum(1000, 9999));
    const expireDate = new Date(Date.now() + FiveMinutes);
    await this.sequelizeDb.sequelize.transaction(async (transaction) => {
      try {
        const existing = await this.sequelizeDb.Cache.findOne({
          transaction,
          where: { id: phone },
        });
        if (!existing) {
          await this.sequelizeDb.Cache.create(
            {
              id: phone,
              name: 'textMessageCode',
              data: code,
              expireDate,
            },
            {
              transaction,
            }
          );
        } else {
          await this.sequelizeDb.Cache.update(
            {
              data: code,
              expireDate,
            },
            {
              transaction,
              where: {
                id: phone,
              },
            }
          );
        }
      } catch (e) {
        this.appLog.error(e);
      }
    });
    return code;
  }

  async getMessageCodeByPhone(phone: string) {
    const cacheData = await this.sequelizeDb.Cache.findOne({
      where: {
        [Op.and]: [
          {
            phone,
          },
          {
            expireDate: {
              [Op.gt]: new Date(),
            },
          },
        ],
      },
    });
    if (!cacheData) {
      return null;
    }
    // return cacheData!.data;
  }

  async findUserByPhone(phone: string) {
    const user = await this.sequelizeDb.Users.findOne({
      where: {
        phone,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async createUser(userInfo: CreatedUserInfo) {
    const { hashPassword } = userInfo;
    const newHashPassword = sha1(hashPassword).toString();

    const newUser = this.sequelizeDb.Users.create({
      ...userInfo,
      hashPassword: newHashPassword,
    });

    return newUser;
  }
}
