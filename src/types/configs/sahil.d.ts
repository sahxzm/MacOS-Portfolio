export interface SahilMdData {
  id: string;
  title: string;
  file: string;
  icon: string;
  excerpt: string;
  link?: string;
}

export type SahilData = {
  id: string;
  title: string;
  icon: string;
  md: SahilMdData[];
}[];
