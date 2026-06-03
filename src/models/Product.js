import mongoose from "mongoose";

//schema define la forma de los datos 
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

//model permite hacer operaciones crud sobre esos datos
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
