import { ApiError } from "../utils/ApiError.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const requireOwner = (req, _res, next) => {
  const raw = req.header("x-user-email");
  if (!raw) {
    return next(new ApiError(401, "Missing X-User-Email header"));
  }
  const email = raw.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return next(new ApiError(400, "Invalid owner email"));
  }
  req.ownerEmail = email;
  next();
};
