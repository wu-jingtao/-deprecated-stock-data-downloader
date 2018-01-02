import { DockerServicesManager } from 'service-starter';

import { MysqlConnection } from './modules/MysqlConnection/MysqlConnection';

class StockDataDownloader extends DockerServicesManager { }

const manager = new StockDataDownloader();

manager.registerService(new MysqlConnection);

manager.start();