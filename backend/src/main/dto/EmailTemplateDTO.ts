export interface EmailTemplateCreationDTO {
  template: string;
  title: string;
  businessId: number;
}

export interface EmailTemplateUpdateDTO {
  id?: number;
  template?: string;
  title?: string;
  businessId?: number;
}
