export interface INotebookConfig {
  filePath: string;
  preliminaryConfig?: IPreliminaryConfig;
  descriptiveStatConfig?: IDescriptiveStatConfig;
}

export interface IPreliminaryConfig {
  projectDescription?: boolean;
  importLibraries?: string[];
  importData?: boolean;
  columnsToDrop?: string[];
  nullValues?: boolean;
}

export interface IDescriptiveStatConfig {
  histograms?: boolean;
  scatterPlots?: {
    numOfPlotsPerRow: number;
    yVar: string;
  };
  featureToFeatureCorr?: {
    targetVariable: string;
  };
}
