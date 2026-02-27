export interface AnswersState {
  expectMore: string | null;
  considerMeta: string | null;

  usesMeta: string | null;
  nativeLanguage: string | null;
  metaAccuracy: string | null;
  sliderValue: number;

  awareness: string;
  foreignWorkers: string;
  foreignWorkersPercent: number;
  topNationalities: string[];
  nationalitySearch: string;
}