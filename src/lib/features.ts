export const FEATURES = {
  // MVP Features - Fase 1-4
  IMOVEIS: true,
  LIA: true, 
  VIABILIDADES: true,
  VISITAS: true,
  SCRAPING: true,
  NOTICIAS: false,        // Ativar depois
  
  // Future Features - Fase 5+
  PROJETOS_REFORMA: false, 
  FINANCEIRO: false,
  MULTI_TENANT: false,
  ANALYTICS: false,
} as const;

export type FeatureName = keyof typeof FEATURES;

export function isFeatureEnabled(feature: FeatureName): boolean {
  return FEATURES[feature];
}

export function getEnabledFeatures(): FeatureName[] {
  return Object.keys(FEATURES).filter((key) => 
    FEATURES[key as FeatureName]
  ) as FeatureName[];
}