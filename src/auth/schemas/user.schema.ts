import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Document } from "mongoose";

export enum UserRoles {
    ADMIN='admin',
    USER='user',
}

@Schema()
export class User extends Document {

    @Prop()
    name: string;

    @Prop({ unique: [true, 'Duplicated email entered'] })
    email: string;

    @Prop({ select: false })
    password: string;

    @Prop({
        enum: UserRoles,
        default: UserRoles.USER
    })
    role: UserRoles;
}


export const UserSchema = SchemaFactory.createForClass(User);