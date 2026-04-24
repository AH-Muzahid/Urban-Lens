export interface UrbanMetrics {
  walkability: {
    value: number; // Raw value (count)
    score: number; // 0-100 score
    label: string;
    subtext: string;
    details: {
      sources: string[];
      method: string;
      limitations: string;
    };
  };
  greenspace: {
    value: number; // Raw value (%)
    score: number; // 0-100 score
    label: string;
    subtext: string;
    details: {
      sources: string[];
      method: string;
      limitations: string;
    };
  };
  density: {
    value: number; // Raw value (count)
    score: number; // 0-100 score
    label: string;
    subtext: string;
    details: {
      sources: string[];
      method: string;
      limitations: string;
    };
  };
  transit: {
    value: number; // Raw value (count)
    score: number; // 0-100 score
    label: string;
    subtext: string;
    details: {
      sources: string[];
      method: string;
      limitations: string;
    };
  };
  noise: {
    value: number; // Raw value (weighted proxy)
    score: number; // 0-100 score
    label: string;
    subtext: string;
    details: {
      sources: string[];
      method: string;
      limitations: string;
    };
  };
  metadata: {
    coverage: number;
    confidence: "High" | "Medium" | "Low";
    locationName: string;
    radius: number;
    lat: number;
    lng: number;
  };
}
