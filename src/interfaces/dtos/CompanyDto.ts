export interface IRegisterCompanyDto {
  name: string;
  email: string;
  size: number;
  type: string;
}

export interface IGetAllCompanyReponseDto {
  id: string;
  name: string;
  type: string;
  size: number;
  email: string;
  phone: string;
  website?: string
  status: "active" | "suspended"
  createdAt?: Date;
}

export interface IGetAllCompanyDto {
  search: string;
  page: number;
  limit: number;
}


export interface IToggleCompanyStatus {
  companyId: string
}