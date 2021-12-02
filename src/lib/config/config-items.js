const configItems = [
  // 配置文件位置
  {
    key: 'config',
    envVar: 'CONFIG',
    defaultValue: '',
  },
  // 服务器开放 IP
  {
    key: 'ip',
    envVar: 'IP',
    defaultValue: '0.0.0.0',
  },
  // 服务器开放端口
  {
    key: 'port',
    envVar: 'PORT',
    defaultValue: 80,
  },
  // 公共资源地址
  {
    key: 'publicUrl',
    envVar: 'PUBLIC_URL',
    defaultValue: '',
  },
  // 挂载路径
  {
    key: 'baseUrl',
    envVar: 'BASE_URL',
    defaultValue: '',
  },
  // 服务器连接超时的秒数
  {
    key: 'timeoutSeconds',
    envVar: 'TIMEOUT_SECONDS',
    defaultValue: 300,
  },
  // session 维持的分钟数
  {
    key: 'sessionMinutes',
    envVar: 'SESSION_MINUTES',
    defaultValue: 60,
  },
  // session 存储方式
  {
    key: 'sessionStore',
    envVar: 'SESSION_STORE',
    defaultValue: 'memory', // database, redis, memory, file
  },
  {
    key: 'cookieName',
    envVar: 'COOKIE_NAME',
    defaultValue: 'ivoice.sid',
  },
  // cookie 中 secret 签名
  {
    key: 'cookieSecret',
    envVar: 'COOKIE_SECRET',
    defaultValue: 'ivoice.cookie.secret',
  },
  // 后端数据库地址
  {
    key: 'backendDBURI',
    envVar: 'BACKEND_DB_URI',
    defaultValue: '',
  },
  // 是否进行数据库迁移操作的标记
  {
    key: 'dbAutomigrate',
    envVar: 'DB_AUTOMIGRATE',
    defaultValue: true,
  },
  // 是否只进行数据库迁移操作的标记
  {
    key: 'migrate',
    envVar: 'MIGRATE',
    defaultValue: '',
  },
  // 应用日志级别
  {
    key: 'appLogLevel',
    envVar: 'APP_LOG_LEVEL',
    defaultValue: 'info',
  },
  // 网络日志级别
  {
    key: 'webLogLevel',
    envVar: 'WEB_LOG_LEVEL',
    defaultValue: 'info',
  },
  // HTTPS 证书位置
  {
    key: 'certPath',
    envVar: 'HTTPS_CERT_PATH',
    defaultValue: '',
  },
  // HTTPS 私钥位置
  {
    key: 'keyPath',
    envVar: 'HTTPS_KEY_PATH',
    defaultValue: '',
  },
  // HTTPS 证书口令
  {
    key: 'certPassphrase',
    envVar: 'HTTPS_CERT_PASSPHRASE',
    defaultValue: '',
  },
  // redis 地址
  {
    key: 'redisUri',
    envVar: 'REDIS_URI',
    defaultValue: '',
  },
  // 消息队列地址
  {
    key: 'rabbitMQUri',
    envVar: 'RABBIT_MQ_URI',
    defaultValue: 'amqp://localhost',
  },
  // 是否使用消息队列的标记
  {
    key: 'useMessageQueue',
    envVar: 'USE_MESSAGE_QUEUE',
    defaultValue: false,
  },
  // 音频位置
  {
    key: 'audioFilesDirName',
    envVar: 'AUDIO_FILES_DIR_NAME',
    defaultValue: 'audioFiles',
  },
  // 识别结果文件位置
  {
    key: 'recognizeResultFilesDirName',
    envVar: 'RECOGNIZE_RESULT_FILES_DIR_NAME',
    defaultValue: 'recognizeResultFiles',
  },
  // 是否衍生工作进程的标记
  {
    key: 'autoForkProcess',
    envVar: 'AUTO_FORK_PROCESS',
    defaultValue: 'true',
  },
  // 集群最大工作进程数
  {
    key: 'maxWorkerProcess',
    envVar: 'MAX_WORKER_PROCESS',
    defaultValue: 32,
  },
  // 集群最大工作进程数
  {
    key: 'salt',
    envVar: 'SALT',
    defaultValue: '',
  },
  // 是否启用短信验证码的标记
  {
    key: 'messageCodeAvailable',
    envVar: 'MESSAGE_CODE_AVAILABLE',
    defaultValue: true,
  },
];

module.exports = configItems;
