export interface Guardian {
  name: string;
  phone: string;
  relation?: string;
}

export interface UserSettings {
  fontSize: 'normal' | 'large' | 'xlarge';
  contrastMode: boolean;
  guardian?: Guardian;
}

export interface HelpRequestLog {
  id: string;
  guideId?: string;
  guideTitle?: string;
  message: string;
  createdAt: string;
}

export interface ScamCheckResult {
  level: 'safe' | 'caution' | 'danger';
  summary: string;
  reasons: string[];
  doNot: string[];
  nextAction: string;
}

export interface GuideStep {
  instruction: string;
  detail?: string;
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  steps: GuideStep[];
}
