export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiFail = {
  message: string;
};

export class ApiResponse {
  static success<T>(data: T): ApiSuccess<T> {
    return {
      success: true,
      data,
    };
  }

  static fail(message: string): ApiFail {
    return {
      message,
    };
  }
}
