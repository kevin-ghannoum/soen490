export interface AddressUpdateDTO {
  cityName?: string;
  province?: string;
  country?: string;
  postalCode?: string;
  streetName?: string;
  civicNumber?: number;
}

export interface AddressCreationDTO {
  cityName: string;
  province: string;
  country: string;
  postalCode: string;
  streetName: string;
  civicNumber: number | null;
}
