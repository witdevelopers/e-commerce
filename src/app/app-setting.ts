import * as _settings from './settings.json';

const settings = _settings as {
  AppName: string;
  IsDevelopment: boolean;
  IsTestNetworkSupported: boolean;
  MainNetContractAddress: string;
  TestNetContractAddress: string;
  DefaultSponsor: string;
  TokenContractAddress: string;
  CoinName: string;
  CoinSymbol: string;
  PaymentToken: string;
  Website: string;
  Logo: string;
  MainNetExplorer: string;
  TestNetExplorer: string;
  MainNetHttpProvider: string;
  ApiUrl: string;
  ApiUrlLive: string;
  Abi: any[];
};

export class Settings {
  static AppName: string = settings.AppName;
  static isDevelopment: boolean = settings.IsDevelopment;
  static IsTestNetworkSupported: boolean = settings.IsTestNetworkSupported;

  static contractAddress: string = Settings.IsTestNetworkSupported 
    ? settings.TestNetContractAddress 
    : settings.MainNetContractAddress;

  static DefaultSponsor: string = settings.DefaultSponsor;
  static abi: any[] = settings.Abi;

  static tokenContractAddress: string = settings.TokenContractAddress;
  static paymentToken: string = settings.PaymentToken;
  static coinName: string = settings.CoinName;
  static coinSymbol: string = settings.CoinSymbol;
  static website: string = settings.Website;
  static logo: string = settings.Logo;
  
  static explorer: string = Settings.IsTestNetworkSupported 
    ? settings.TestNetExplorer 
    : settings.MainNetExplorer;

  static mainnetHttpProvider: string = settings.MainNetHttpProvider;
  static apiUrl: string = Settings.isDevelopment ? settings.ApiUrl : settings.ApiUrlLive;
  static wsUrl: string = Settings.isDevelopment ? settings.ApiUrl : settings.ApiUrlLive;

  static roiRecordsLimit: number = 10;
  static ApiUrlLive: string;
}
