export interface ApiResponse<T = void> {
  status: number;
  message: string;
  timestamp: string;
  data: T;
}

