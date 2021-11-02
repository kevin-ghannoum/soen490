export interface FeedbackCreationDTO {
  title: string;
  comment: string;
  rating: number;
  projectId: number;
}

export interface FeedbackUpdateDTO {
  title?: string;
  comment?: string;
  rating?: number;
  projectId?: number;
}
