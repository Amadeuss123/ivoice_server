const { generateRandomNum } = require('../utils/number');
const { Op } = require('sequelize');
const sha1 = require('crypto-js/sha1');

const FiveMinutes = 1000 * 60 * 5;
class Users {
  constructor(sequelizeDb, config, appLog) {
    this.sequelizeDb = sequelizeDb;
    this.config = config;
    this.appLog = appLog;
  }

  async generateMessageCode(phone) {
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

  async getMessageCodeByPhone(phone) {
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
    return cacheData.data;
  }

  async findUserByPhone(phone) {
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

  async createUser(userInfo) {
    const { hashPassword, createInfo } = userInfo;
    const newHashPassword = sha1(hashPassword).toString();
    createInfo.passhash = newHashPassword;

    const newUser = this.sequelizeDb.Users.create(createInfo);

    return newUser;
  }
}

module.exports = Users;
