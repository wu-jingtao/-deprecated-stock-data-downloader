import { DockerServicesManager } from 'service-starter';

import { MysqlConnection } from './modules/MysqlConnection/MysqlConnection';
import { StockMarketList } from './modules/StockMarketList/StockMarketList';
import { ModuleStatusRecorder } from './modules/ModuleStatusRecorder/ModuleStatusRecorder';
import { StockCodeDownloader } from './modules/StockCodeDownloader/StockCodeDownloader';
import { StockBasicDownloader } from './modules/StockBasicDownloader/StockBasicDownloader';
import { StockDayLineDownloader } from './modules/StockDayLineDownloader/StockDayLineDownloader';
import { Stock_FQ_DayLineDownloader } from './modules/Stock_FQ_DayLineDownloader/Stock_FQ_DayLineDownloader';

class StockDataDownloader extends DockerServicesManager { }

const manager = new StockDataDownloader();

manager.registerService(new MysqlConnection);
manager.registerService(new ModuleStatusRecorder);
manager.registerService(new StockMarketList);
manager.registerService(new StockCodeDownloader);
manager.registerService(new StockBasicDownloader);
manager.registerService(new StockDayLineDownloader);
manager.registerService(new Stock_FQ_DayLineDownloader);

manager.start();