export interface IRegisterUserPayload {
  name: string;
  email: string;
  password: string;
  role?: 'CUSTOMER' | 'PROVIDER';
}

export interface ILoginUserPayload {
  email: string;
  password: string;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface IUpdateProfilePayload {
  name?: string;
  image?: string;
  description?: string;
  address?: string;
  phone?: string;
}
