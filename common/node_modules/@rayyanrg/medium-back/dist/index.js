"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogs = exports.blogsInputs = exports.signinInputs = exports.signupInputs = void 0;
const zod_1 = require("zod");
exports.signupInputs = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
    name: zod_1.z.string().min(6)
});
exports.signinInputs = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
exports.blogsInputs = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string()
});
exports.updateBlogs = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string(),
    id: zod_1.z.number()
});
