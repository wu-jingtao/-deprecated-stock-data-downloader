import { DockerServicesManager } from 'service-starter';

import { MysqlConnection } from './modules/MysqlConnection/MysqlConnection';
import { StockMarketList } from './modules/StockMarketList/StockMarketList';
import { ModuleStatusRecorder } from './modules/ModuleStatusRecorder/ModuleStatusRecorder';
import { StockCodeDownloader } from './modules/StockCodeDownloader/StockCodeDownloader';
import { StockBasicDownloader } from './modules/StockBasicDownloader/StockBasicDownloader';
import { StockDayLineDownloader } from './modules/StockDayLineDownloader/StockDayLineDownloader';
import { Stock_FQ_DayLineDownloader } from './modules/Stock_FQ_DayLineDownloader/Stock_FQ_DayLineDownloader';
import { StockTradeDetailDownloader, StockTradeDetailDownloader_All } from './modules/StockTradeDetailDownloader/StockTradeDetailDownloader';
import { CreateSqlView } from './modules/CreateSqlView/CreateSqlView';

class StockDataDownloader extends DockerServicesManager { }

const manager = new StockDataDownloader();

manager.registerService(new MysqlConnection);
manager.registerService(new ModuleStatusRecorder);
manager.registerService(new StockMarketList);
manager.registerService(new StockCodeDownloader);
manager.registerService(new StockBasicDownloader);
manager.registerService(new StockDayLineDownloader);
manager.registerService(new Stock_FQ_DayLineDownloader);

//这个由于下载的数据量太大，暂不下载
//manager.registerService(new StockTradeDetailDownloader);
//manager.registerService(new StockTradeDetailDownloader_All);

manager.registerService(new CreateSqlView);

manager.start();