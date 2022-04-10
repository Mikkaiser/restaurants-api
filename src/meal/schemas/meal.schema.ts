import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "../../auth/schemas/user.schema";
import { Restaurant } from "../../restaurants/schemas/restaurant.schema";


export enum Category {
    SOUPS = 'Soups',
    SALADS = 'Salads',
    SANDWICHES = 'Sandwiches',
    PASTA = 'Pasta'
}

@Schema({
    timestamps: true
})
export class Meal {
    @Prop()
    name:string;

    @Prop()
    description:string;

    @Prop()
    price: number;

    @Prop()
    category: Category;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
    restaurant: Restaurant;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;
}

export const MealSchema = SchemaFactory.createForClass(Meal);