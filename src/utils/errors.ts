export class HttpError extends Error {
  statusCode: number;
  errors?: unknown;

  constructor(
    statusCode: number,
    name: string,
    message: string,
    errors?: unknown
  ) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.errors = errors;

    // TODO: write the stack!
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Bad Request", errors?: unknown) {
    super(400, "BadRequestError", message, errors);
  }
}

export class ServerError extends HttpError {
  constructor(message = "Server Error", errors?: unknown) {
    super(500, "Server Error", message, errors);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Not Found", errors?: unknown) {
    super(404, "NotFoundError", message, errors);
  }
}

export class NotAuthenticatedError extends HttpError {
  constructor(message = "Not Authenticated", errors?: unknown) {
    super(401, "Not Authenticated", message, errors);
  }
}

export class NotAuthorizedError extends HttpError {
  constructor(message = "Not Authenticated", errors?: unknown) {
    super(403, "Not Authorized", message, errors);
  }
}
