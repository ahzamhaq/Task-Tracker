import api from "./api.js";

export const taskService = {
  list: (params) => api.get("/tasks", { params }).then((r) => r.data),
  get: (id) => api.get(`/tasks/${id}`).then((r) => r.data),
  create: (payload) => api.post("/tasks", payload).then((r) => r.data),
  update: (id, payload) => api.put(`/tasks/${id}`, payload).then((r) => r.data),
  archive: (id) => api.post(`/tasks/${id}/archive`).then((r) => r.data),
  restore: (id) => api.post(`/tasks/${id}/restore`).then((r) => r.data),
  remove: (id) => api.delete(`/tasks/${id}`).then((r) => r.data),
};
