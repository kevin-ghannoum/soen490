export interface CRUD {
  create: (resource: any) => Promise<any>;
  delete: (resource: any) => Promise<any>;
  update: (resource: any) => Promise<any>;
  get: (resource: any) => Promise<any>;
  getAll: () => Promise<any[]>;
}
