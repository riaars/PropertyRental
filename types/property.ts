export type PropertyDataProps = {
  _id: string;
  type: string;
  name: string;
  description: string;
  location: {
    city: string;
    state: string;
    street: string;
    zipcode: string;
  };
  beds: number;
  baths: number;
  square_feet: number;
  amenities: string[];
  rates: {
    nightly: number;
    weekly: number;
    monthly: number;
  };
  seller_info: {
    name: string;
    email: string;
    phone: string;
  };
  owner: string;
  images: File[];
  createdAt: Date;
  updatedAt: Date;
};
