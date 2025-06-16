export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
  confirmed: boolean;
  confirmation_token: string;
  unsubscribe_token: string;
}

export type NewsletterSubscriberInsert = {
  email: string;
  confirmed?: boolean;
};

export type NewsletterSubscriberUpdate = {
  confirmed?: boolean;
};
