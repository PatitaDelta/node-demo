import express from "express";
import cors from "cors";
import createHomeRouter from "./src/home/home.routes.js";
import createUserRouter from "./src/users/user.router.js";
export const app = express();
export default function initApiRest() {
    var _a;
    const homeRouter = createHomeRouter();
    const userRouter = createUserRouter();
    app.disable("x-powered-by");
    app.use(express.json());
    app.use(cors());
    app.use("/", homeRouter);
    app.use("/users", userRouter);
    const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8080;
    app.listen(PORT, () => {
        console.log(`Listening in the port ${PORT}`);
    });
}
