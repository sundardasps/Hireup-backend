
import express from 'express'
import env from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'


const app = express();
env.config()

mongoose.connect("mongodb://127.0.0.1:27017/react-secondProject")
app.use(express.json())


//-------------------------requireing-Routes------------------------------//

import userRoute from './routes/userRoutes.js'
import companyRoute from './routes/companyRoutes.js'
import adminRoute from './routes/adminRoutes.js'

//-------------------------------Cors config----------------------------//

const corsOptions = {
  origin: "http://localhost:5173",
  methos: ["GET,POST","PUT"]
};
app.use(cors(corsOptions));

//----------------------------------Routes------------------------------//

app.use("/user",userRoute);
app.use("/company",companyRoute);
app.use("/admin", adminRoute);

//----------------------------------Server------------------------------//

let port = 5000;

app.listen(port, () => {
  console.log(`server started running in ${port}`);
});
