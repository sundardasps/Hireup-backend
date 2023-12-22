
import express from 'express'
import env from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import {app,server} from './socket/socket.js'


env.config()

mongoose.connect("mongodb://127.0.0.1:27017/react-secondProject")

//middleware
app.use(express.json())


//-------------------------requireing-Routes------------------------------//

import userRoute from './routes/userRoutes.js'
import companyRoute from './routes/companyRoutes.js'
import adminRoute from './routes/adminRoutes.js'

//-------------------------------Cors config----------------------------//

const corsOptions = {
  origin: process.env.FRONTEND_ENDPOINT,
  methos: ["GET", "POST", "PUT", "PATCH"]
};
app.use(cors(corsOptions));

//----------------------------------Routes------------------------------//

app.use("/user",userRoute);
app.use("/company",companyRoute);
app.use("/admin", adminRoute);

//----------------------------------Server------------------------------//


server.listen(process.env.PORT, () => {
  console.log(`server started running in ${process.env.PORT}`);
});
