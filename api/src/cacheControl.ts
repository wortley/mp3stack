import { NextFunction, Request, Response } from "express";

/**
 * Middleware for setting Cache-Control headers on HTTP responses
 *
 * This middleware sets the appropriate Cache-Control header based on the HTTP request method.
 * For GET requests, it enables caching for 1 day, while for other request types, it sets
 * Cache-Control to prevent caching (no-store).
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function to pass control to the next middleware.
 */
const cacheControl = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.method === "GET") {
    // Set Cache-Control to enable caching for 1 day
    res.set("Cache-Control", "private, max-age=86400, must-revalidate");
  } else {
    // for other request types set no caching
    res.set("Cache-Control", `no-store`);
  }
  next();
};

export default cacheControl;
