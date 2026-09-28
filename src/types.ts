export type EventEntryType = {
  id: number;
  title: string;
  description: string;
  info: string;
  date: string;
  hidden: boolean;
  location: string;
  price: number;
  coverImage: string;
  capacity?: number | null;
  category?: string | null;
};

export type RegistrationType = {
  id: number;
  eventId: number;
  email: string;
  name: string;
  num: number;
  createdAt: string;
}