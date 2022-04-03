import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum UserRoles {
    ADMIN='admin',
    USER='user',
}

@Schema()
export class User {
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