export interface Pais {
  names: {
    common: string;
    official: string;
    translations?: Record<string, { common: string; official: string }>;
  };
  codes: {
    alpha_2: string;
    alpha_3: string;
  };
  capitals?: { name: string }[];
  region: string;
  subregion?: string;
  population?: number;
  flag: {
    emoji?: string;
    url_png?: string;
    url_svg?: string;
    description?: string;
  };
  languages?: { name: string }[];
  currencies?: Record<string, { name: string; symbol: string }>;
}

export interface RestCountriesResponse {
  data?: {
    objects: Pais[];
    meta: { total: number; count: number; limit: number; offset: number; more: boolean };
  };
  errors?: { message: string }[];
}