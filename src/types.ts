export interface CulturalEvent {
  id: string;
  name: string;
  location: string;
  tag: string;
  imageUrl: string;
  description: string;
  seasonMonth: string;
}

export interface ValueProp {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface FomoStat {
  id: string;
  boldText: string;
  subText: string;
  punch: string;
}

export interface WaitlistFormData {
  email: string;
  phone?: string;
  plan: "free" | "founding";
  name: string;
}
