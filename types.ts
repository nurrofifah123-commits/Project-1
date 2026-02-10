
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
}

export interface MarketingAsset {
  id: string;
  url: string;
  type: 'image' | 'video';
  prompt?: string;
}

export enum AppView {
  DASHBOARD = 'dashboard',
  TRANSACTIONS = 'transactions',
  CREATIVE = 'creative',
  INSIGHTS = 'insights',
  VOICE = 'voice'
}
