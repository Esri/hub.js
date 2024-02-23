export interface IS123Question {
  id: string;
  type: string;
  maps?: Array<{ type: string; itemId: string; name: string }>;
  questions?: IS123Question[];
  [key: string]: any;
}

export interface IS123FormJSON {
  questions: IS123Question[];
  [key: string]: any;
}
