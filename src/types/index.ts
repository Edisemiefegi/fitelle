export interface UserType {
  id: string;
  email: string;
  brandName: string;
  profileImage?: string;
  fullName?: string;
  phoneNumber?: string;
}


export interface MediaFile {
  fileId: string;
  url: string; 
  uploadedAt: string; 
  visibleToCustomer?: boolean;
}