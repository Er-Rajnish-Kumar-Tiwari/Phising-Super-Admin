export interface EmailTemplate {
    _id: string;
    templateName: string;
    templateType: string;
    content: string;
    category: string;
    image: string;
  }
  
export  interface PaginatedTemplatesResponse {
    total: number;
    page: number;
    pageSize: number;
    templates: EmailTemplate[];
  }