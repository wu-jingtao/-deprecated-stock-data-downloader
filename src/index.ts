import { DockerServicesManager, BaseServiceModule } from 'service-starter';

import { MysqlConnection } from './modules/MysqlConnection/MysqlConnection';
import { StockMarketDownloader } from './modules/StockMarketDownloader/StockMarketDownloader';

class StockDataDownloader extends DockerServicesManager {

    
    onError(errName: string | undefined, err: Error, service: BaseServiceModule) {

    }
}

const manager = new StockDataDownloader();

manager.registerService(new MysqlConnection);
manager.registerService(new StockMarketDownloader);

manager.start();