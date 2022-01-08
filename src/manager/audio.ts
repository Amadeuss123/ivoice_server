import { AudioInfo } from "@routers/interface";
import { Op } from "sequelize";
import Config from "../lib/config";
import AppLogger from "../lib/log/logger";
import SequelizeDb from "../sequelize";

class AudioManager {
  private sequelizeDb: SequelizeDb;
  private config: Config;
  private appLog: AppLogger;
  public constructor(sequelizeDb: SequelizeDb, config: Config, appLog: AppLogger) {
    this.sequelizeDb = sequelizeDb;
    this.config = config;
    this.appLog = appLog;
  }
  
  public async createAudio(userId: string, audioInfoList: Array<AudioInfo>) {
    try {
      await Promise.all(audioInfoList.map(async (audioInfo) => {
        const { id, name, duration, ftpStorePath } = audioInfo;
        const result = await this.sequelizeDb.Audio.create({
          id,
          name,
          path: ftpStorePath,
          userId,
          audioTime: Number(duration.toFixed(2)),
        })
        return result;
      }))
    }catch (e) {
      console.log(e)
    }
  }

  public async findAudiosByIds(fileIds: string[]) {
    const audioList = await this.sequelizeDb.Audio.findAll({
      where: {
        id: fileIds,
      }
    });
    return audioList.map((audioInstance) => audioInstance.toJSON());
  }

}

export default AudioManager;
