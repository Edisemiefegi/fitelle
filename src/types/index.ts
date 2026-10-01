export interface UserType {
  id: string;
  email: string;
  brandName: string;
  profileImage?: string;
  fullName?: string;
  phoneNumber?: string;
  location?: string;
  description?: string;
  notifications?: boolean;
  whatsapp?: boolean 
  slug?: string;
}


export interface MediaFile {
  fileId: string;
  url: string; 
  uploadedAt: string; 
  visibleToCustomer?: boolean;
}