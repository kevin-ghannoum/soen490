export interface BusinessCreationDTO {
  name: string;
  industry: string;
  website: string;
  email: string;
}

export interface BusinessUpdateDTO {
  // Business
  business?: {
    name?: string;
    industry?: string;
    website?: string;
  };

  // Account related to the Business
  account?: {
    email: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    password?: string;
    phoneNumber?: string;
  };

  // Address related to the Business
  address?: {
    id: number;
    civicNumber?: number;
    streetName?: string;
    postalCode?: string;
    cityName?: string;
    province?: string;
    country?: string;
  };

  // Social Media Page related to the Business
  socialMediaPage?: {
    link: string;
    name: string;
  };
  newSocialMediaPage?: {
    link?: string;
    name?: string;
    businessId?: number;
    email?: string;
  };
}
