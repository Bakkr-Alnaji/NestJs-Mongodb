import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from './product.model';

@Injectable()
export class ProductsService {
  //Model<> generic type of Product. Because of queries?
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async insertProduct(title: string, desc: string, price: number) {
    const newProduct = new this.productModel({
      //title: title
      title,
      description: desc,
      price,
    });
    //save new product in the db, .save() returns a promise
    const result = await newProduct.save();
    return result.id as string;
  }

  async getProducts() {
    //exec() makes the find() return a real array
    const products = await this.productModel.find().exec();
    //formatting the data we are getting to fit the schema. products is an array
    return products.map(prod => ({
      id: prod.id,
      title: prod.title,
      description: prod.description,
      price: prod.price,
    }));
  }

  async getProduct(prodId: string) {
    const product = await this.findProduct(prodId);
    return product;
  }
  // organization
  private async findProduct(id: string) {
    //best way to handle errors is try and catch.
    //decalre product outside of try to make it global to the function
    let product;
    try {
      product = await this.productModel.findById(id);
      console.log(product);
      //returns propper format
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
      };
    } catch (error) {
      throw new NotFoundException('Could not find product');
    }
  }

  //note: the best way to update is using save()
  async updateProduct(
    prodId: string,
    prodTitle: string,
    prodDesc: string,
    prodPrice: number,
  ) {
    const updatedProduct = await this.productModel.findById(prodId);
    if (prodTitle) {
      updatedProduct.title = prodTitle;
    }
    if (prodDesc) {
      updatedProduct.description = prodDesc;
    }
    if (prodPrice) {
      updatedProduct.price = prodPrice;
    }
    updatedProduct.save();
    console.log(updatedProduct);
    return updatedProduct;
  }

  // async deleteProduct(prodId: string) {
  //   const result = await this.productModel.deleteOne({ _id: prodId }).exec();
  //   if (result.n === 0) {
  //     throw new NotFoundException('Could not find product.');
  //   }
  // }
}
