export interface SocialMediaPageCreationDTO {
  link: string;
  name: string;
  accountEmail: string;
}

export interface SocialMediaPageUpdateDTO {
  link?: string;
  name?: string;
  accountEmail?: string;
}

export interface SocialMediaPageKey {
  link: string;
  name: string;
}
