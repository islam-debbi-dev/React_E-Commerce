export type ActionResponseType = {
  success: boolean;
  message: string;
  issues?: {
    [field: string]: string[];
  };
  token?: string;
};
