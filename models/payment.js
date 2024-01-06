import mongoose from 'mongoose'

const paymentSchema = mongoose.Schema({

    companyId:{
        type:String,
    },
    paymentAmount:{
        type:String
    },
    subscription_type:{
        type:String
    }

},
  { timestamps:true}
)

const paymentModel = await mongoose.model("payment",paymentSchema)
export default paymentModel