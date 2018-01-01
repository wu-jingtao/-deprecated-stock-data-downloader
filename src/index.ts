import { DockerServicesManager } from 'service-starter';
import { MysqlConnection } from './MysqlConnection';

class StockDataDownloader extends DockerServicesManager { }

const manager = new StockDataDownloader();

manager.registerService(new MysqlConnection);

manager.start();