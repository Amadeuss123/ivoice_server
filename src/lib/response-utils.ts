import { NextFunction, Response } from "express";

/**
 * A collection of utilities to send a variety of responses to client.
 */
class ResponseUtils {
  private response: Response;
  private next: NextFunction;
  constructor(res: Response, next: NextFunction) {
    this.response = res;
    this.next = next;
  }

  /**
   * Send data response to client
   * @param {(object|object[])} [data] - data to send to client
   */
  data(data?: any) {
    return this.response.json(data || {});
  }

  /**
   * Send a 400 error response to client.
   * Derives error object from data passed in
   * @param {(string|Error|object)} data - string, Error, or preformed object
   */
  error(data: any) {
    const error: {[key: string]: string} = {};

    // Populate error object from data passed in
    if (typeof data === 'string') {
      error.title = data;
    } else if (data instanceof Error) {
      error.title = data.message || data.toString();
    } else if (typeof data === 'object') {
      Object.assign(error, data);
    } else {
      throw new Error('Unexpected error data');
    }

    return this.response.status(400).json(error);
  }

  /**
   * Send a 404 with an error object
   */
  notFound(detail?: string) {
    this.response.status(404).json({ title: 'Not found', detail });
  }

  /**
   * User is not authenticated
   * @param {String} [detail] - optional message to include in detail property
   */
  unauthorized(detail: string) {
    const error = {
      title: 'Unauthorized',
      detail,
    };
    return this.response.status(401).json(error);
  }

  /**
   * For when request was understood, and user is authenticated,
   * but user is not allowed to perform the action
   */
  forbidden(detail: string) {
    const error = {
      title: 'Forbidden',
      detail,
    };
    return this.response.status(403).json(error);
  }
}

export default ResponseUtils;
