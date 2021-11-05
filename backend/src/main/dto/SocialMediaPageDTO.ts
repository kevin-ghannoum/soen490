// Either accountEmail or businessId can exists. At least one of them has to be null.

export interface SocialMediaPageCreationDTO {
  link: string;
  name: string;
  email?: string;
  businessId?: number;
}

export interface SocialMediaPageUpdateDTO {
  link?: string;
  name?: string;
  accountEmail?: string;
  businessId?: string;
}

export interface SocialMediaPageKey {
  link: string;
  name: string;
}
