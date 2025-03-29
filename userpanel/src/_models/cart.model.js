export const cartModel = {
    id:{
        type:String,
        unique:true
    },
    userId: {
        type:String,
        ref: 'user',
    },
    productId : {
        type:String,
        ref:'products',
        unique:true
    },
    quantity : {
        type:Number
    },
    variations: {
        type: [
            {
                variationId:{
                    type:String
                },
                variationTypeId:{
                    type:String
                }
            }
        ],
        ref: 'variation'
    },
    createdDate:Date,
    updatedDate:Date,
};
