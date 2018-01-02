import { DockerServicesManager } from 'service-starter';

import { MysqlConnection } from './modules/MysqlConnection/MysqlConnection';
import { StockMarketDownloader } from './modules/StockMarketDownloader/StockMarketDownloader';

class StockDataDownloader extends DockerServicesManager { }

const manager = new StockDataDownloader();

manager.registerService(new MysqlConnection);
manager.registerService(new StockMarketDownloader);

manager.start();