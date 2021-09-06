// Exception class to be use for http exception. \
// If you need more customization, create new exception class and extend this one

class HttpException extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export default HttpException;
