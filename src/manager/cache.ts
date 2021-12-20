import { generateRandomHexNum, generateRandomNum } from "@utils/number";
import { Op } from "sequelize";
import Config from "../lib/config";
import AppLogger from "../lib/log/logger";
import SequelizeDb from "../sequelize";

const FiveMinutes = 5 * 60 * 1000;

class CacheManager {
  private sequelizeDb: SequelizeDb;
  private config: Config;
  private appLog: AppLogger;
  constructor(sequelizeDb: SequelizeDb, config: Config, appLog: AppLogger) {
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
    const cacheModelData = await this.sequelizeDb.Cache.findOne({
      where: {
        [Op.and]: [
          {
            id: phone,
          },
          {
            expireDate: {
              [Op.gt]: new Date(),
            },
          },
        ],
      },
    });
    if (!cacheModelData) {
      return null;
    }

    const cacheData = cacheModelData.toJSON();
    return cacheData.data;
  }

  async generateSignInVerifiedNum(username: string) {
    const verifiedNum = generateRandomHexNum();
    const expireDate = new Date(Date.now() + FiveMinutes);
    await this.sequelizeDb.sequelize.transaction(async (transaction) => {
      const isExist = await this.sequelizeDb.Cache.findOne({
        where: {
          id: username,
        },
        transaction,
      });
      if (!isExist) {
        await this.sequelizeDb.Cache.create({
          id: username,
          name: 'signinVerifiedNum',
          data: verifiedNum,
          expireDate,
        }, {
          transaction,
        });
      } else {
        await this.sequelizeDb.Cache.update({
          data: verifiedNum,
          expireDate,
        }, {
          where: {
            id: username,
          },
          transaction,
        });
      }
    });
    return verifiedNum;
  }

  async getSignInVerifiedNum(username: string) {
    const verifiedNum = await this.sequelizeDb.Cache.findOne({
      where: {
        [Op.and]: [
          {
            id: username,
          },
          {
            expireDate: {
              [Op.gt]: new Date(),
            }
          }
        ]
      }
    });
    if (!verifiedNum) {
      return null;
    }
    return verifiedNum.toJSON().data;
  };
}

export default CacheManager;
