export type EventEntryType = {
  id: number;
  title: string;
  description: string;
  info: string;
  date: Date;
  hidden: boolean;
  location: string;
  price: number;
  coverImage: string;
  capacity?: number | null;
};

export type RegistrationType = {
  id: number;
  eventId: number;
  email: string;
  name: string;
  num: number;
  createdAt: Date;
}