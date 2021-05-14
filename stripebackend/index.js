const cors=require("cors")
const express=require('express')


const stripe=require("stripe")("sk_test_51IpczwSH2HRN2FzsEEXovr4WwlrLuXfWHvIExQwvAdENcM1Q3pD5qzJxvbshMvNoGHCIy6xuWukTsIIsp6uSenPI000seyevZz")
const { v4: uuidv4 } = require('uuid');

const app=express();

app.use(express.json());
app.use(cors());



app.get("/",(req,res)=>{
    res.send("This works")
})

app.post('/payment',(req,res)=>{
    const {product,token}=req.body;
    console.log("PRODUCT",product);
    console.log("PRICE",product.price);
    const idempotencyKey= uuidv4()

    return stripe.customers.create({
        email:token.email,
        source: token.id
    }).then(customer=>{
        stripe.charges.create({
            amount:product.price*100,
            currency:'usd',
            customer:customer.id,
            receipt_email:token.email,
            description:product.name
        },{idempotencyKey})
    })
    .then(result=> res.status(200).json(result))
    .catch(err=>console.log(err))
})

app.listen(4000,()=>{
    console.log("Listening at port 4000")
})