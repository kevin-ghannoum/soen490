export interface BusinessCreationDTO {
  name: string;
  industry: string;
  website: string;
}

export interface BusinessUpdateDTO {
  name?: string;
  industry?: string;
  website?: string;
}
