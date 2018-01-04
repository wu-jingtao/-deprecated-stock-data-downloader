import { DockerServicesManager } from 'service-starter';

import { MysqlConnection } from './modules/MysqlConnection/MysqlConnection';
import { StockMarketTypeList } from './modules/StockMarketTypeList/StockMarketTypeList';
import { ModuleStatusRecorder } from './modules/ModuleStatusRecorder/ModuleStatusRecorder';

class StockDataDownloader extends DockerServicesManager { }

const manager = new StockDataDownloader();

manager.registerService(new MysqlConnection);
manager.registerService(new ModuleStatusRecorder);
manager.registerService(new StockMarketTypeList);

manager.start();