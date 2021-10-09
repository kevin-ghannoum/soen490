export interface EventUpdateDTO {
  location?: string;
  description?: string;
  date?: Date;
  type?: string;
  createdBy?: string;
}

export interface EventCreationDTO {
  location: string;
  description: string;
  date: Date;
  type: string;
  createdBy: string;
}
