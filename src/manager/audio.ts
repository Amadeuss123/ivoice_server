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
        const { id, name, duration, storePath, sampleRate, bitRate, channels, format } = audioInfo;
        const result = await this.sequelizeDb.Audio.create({
          id,
          name,
          path: storePath,
          userId,
          sampleRate,
          bitRate,
          channels,
          format,
          duration: Number(duration.toFixed(2)),
        })
        return result;
      }))
    }catch (e) {
      console.log(e)
    }
  }

  public async findAudioById(audioId: string) {
    const audioInfo = await this.sequelizeDb.Audio.findOne({
      where: {
        id: audioId,
      }
    });
    if (!audioInfo) {
      return null;
    }
    return audioInfo.toJSON();
  }

  public async findAudiosByIds(audioIds: string[]) {
    const audioList = await this.sequelizeDb.Audio.findAll({
      where: {
        id: audioIds,
      }
    });
    return audioList.map((audioInstance) => audioInstance.toJSON());
  }

  public async findAudioListByUserId(userId: string) {
    const audioList = await this.sequelizeDb.Audio.findAll({
      where: {
        userId,
      }
    });
    return audioList.map((audioInstance) => audioInstance.toJSON());
  }

  public async deleteAudioByAudioId(audioId: string) {
    const result = await this.sequelizeDb.Audio.destroy({
      where: {
        id: audioId
      },
    });

    if (result <= 0) {
      return false;
    }
    return true;
  }

}

export default AudioManager;
