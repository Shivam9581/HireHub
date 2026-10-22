import app from "./app";
import env from "./config/env";
import connectToMongoDB from "./config/db";

// import listEndpoints from "express-list-endpoints";

// console.log(listEndpoints(app));

const PORT = env.PORT;
const startServer =  async () => {
    await connectToMongoDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();