import { Logs } from "../models/log.model.js";

export const getAllLogsService = async () => {
  return await Logs.find()
    .populate("user", "name email")
    .populate("component", "name image")
    .sort({ createdAt: -1 });
};

export const getUserLogsService = async (userId) => {
  return await Logs.find({ user: userId })
    .populate("component", "name image")
    .sort({ createdAt: -1 });
};
