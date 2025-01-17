export type CreateUserParams = {
  clerkId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  photo: string;
};

export type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
};

export type eventProps = {
  eventTitle?: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  location?: string;
  startDateTime?: Date;
  endDateTime?: Date;
  price?: string;
  isFree?: boolean;
  url?: string;
};

export type IEvent = {
  _id: string;
  eventTitle: string;
  description?: string;
  location?: string;
  imageUrl: string;
  createdAt: Date;
  startDateTime: Date;
  endDateTime: Date;
  price: string;
  isFree: boolean;
  url?: string;
  category: {
    _id: string;
    name: string;
  };
  organizer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
};

export type createEprops = {
  userId: string;
  values: eventProps;
};

export type SearchParamProps = {
  params: { id: string };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export type DeleteEventParams = {
  eventId: string;
  path: string;
};

export type UpdateEventParams = {
  userId: string;
  values: eventProps;
  event?: IEvent;
};

export type GetRelatedEventsByCategoryParams = {
  categoryId: string;
  eventId: string;
  limit?: number;
  page?: number | string;
};

export type GetEventsByUserParams = {
  userId: string;
  limit?: number;
  page?: number;
};

export type CreateOrderParams = {
  stripeId: string;
  eventId: string;
  buyerId: string;
  totalAmount: string;
  createdAt: Date;
};
export type GetOrdersByUserParams = {
  userId: string | null;
  limit?: number;
  page: string | number | null;
};
export interface IOrder {
  createdAt: Date;
  stripeId: string;
  totalAmount: string;
  event: {
    _id: string;
    title: string;
  };
  buyer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

export type GetOrdersByEventParams = {
  eventId: string;
  searchString: string;
};
