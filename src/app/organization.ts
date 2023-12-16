export interface Organization {
  name: String;
  id: number;
  results: [];
}
export interface Parent {
  id: number;
  name: string;
  children: Child[];
}

export interface Child {
  id: number;
  name: string;
}

export interface ExtendedObject extends Child {
  isOncallAvailable: boolean;
}
export interface Schedule {
  id: number;
  customer: number;
  name: string;
  customer_name: string;
}

export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Schedule[];
  next_page: string | null;
}

export interface whereToFindMe {
  id: number;
  ChannelName: String;
}
