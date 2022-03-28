import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import { Query } from 'express-serve-static-core';
import APIFeatures from 'src/utils/apiFeatures.utils';

@Injectable()
export class RestaurantsService {

    constructor(
        @InjectModel(Restaurant.name)
        private restaurantModel: mongoose.Model<Restaurant>
    ) {}



    async findAll(query: Query) : Promise<Restaurant[]> {

        //Pagination Logic

        //Defining how much result should be displayed per page
        const resultsPerPage = 5;
        //Getting the page passed in query
        const currentPage = Number(query.page) || 1;
        //Formula which defines how many results should be skipped
        const skip = resultsPerPage * (currentPage - 1);

        //Search Logic
        const keyword = query.keyword ? {
            name: {
                $regex: query.keyword,
                $options: 'i'
            }
        } : {};

        return await this.restaurantModel
        .find(keyword)
        .limit(resultsPerPage)
        .skip(skip);
    }

    async findById(id: string) : Promise<Restaurant> {
        const isValidId = mongoose.isValidObjectId(id);

        if(!isValidId) {
            throw new BadRequestException(
                'Wrong mongoose ID Error. Please, enter the correct ID'
            )
        }
        
        const restaurant = await this.restaurantModel.findById(id);

        if(!restaurant) 
            throw new NotFoundException('Restaurant not found');

        return restaurant;
    }

    async create(restaurant: Restaurant) : Promise<Restaurant> {

        const location = await APIFeatures.getRestaurantLocation(restaurant.address);
        console.log(location);


        return await this.restaurantModel.create(restaurant);
    }

    async update(id: string, restaurant: Restaurant) : Promise<Restaurant> {
        return await this.restaurantModel.findByIdAndUpdate(id, restaurant, 
            {
                new: true,
                runValidators: true
            });
    }

    async delete(id: string) : Promise<Restaurant> {
        return this.restaurantModel.findByIdAndDelete(id);
    }

}
