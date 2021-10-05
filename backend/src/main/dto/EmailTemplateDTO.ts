export interface EmailTemplateCreationDTO {
  template: string;
  title: string;
  businessId: number;
}

export interface EmailTemplateUpdateDTO {
  template?: string;
  title?: string;
  businessId?: number;
}
