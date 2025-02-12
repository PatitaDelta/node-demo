import express from "express";
import cors from "cors";
import createHomeRouter from "./src/home/home.routes.js";
import createUserRouter from "./src/users/user.router.js";
export const app = express();
export default function initApiRest(PORT) {
    var _a;
    if (PORT === void 0) {
        PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8080;
    }
    const homeRouter = createHomeRouter();
    const userRouter = createUserRouter();
    app.disable("x-powered-by");
    app.use(express.json());
    app.use(cors());
    app.use("/", homeRouter);
    app.use("/users", userRouter);
    return app.listen(PORT, () => {
        console.log(`Listening in the port ${PORT}`);
    });
}
