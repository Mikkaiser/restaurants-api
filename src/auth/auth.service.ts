import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.entity';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import APIFeatures from 'src/utils/apiFeatures.utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
 constructor(
     @InjectModel(User.name)
     private userModel: Model<User>,
     private jwtService: JwtService
 ) {}



 async hashPassword(password: string) : Promise<string> {
     return bcrypt.hash(password, 10);
}

 async signUp(signUpDto: SignUpDto) : Promise<{ token: string }> {
    const { name, email, password } = signUpDto;

    try {
        const hashedPassword =  await this.hashPassword(password);
    
        const user = await this.userModel.create({
            name, email, password: hashedPassword
        });

        const token = await APIFeatures.assignJwtToken(user.id, this.jwtService)

        return { token };
        
    }
    catch(error){
        if(error.code == 11000)
        throw new ConflictException('Duplicated email entered.')
    }
}

async login(loginDto: LoginDto) : Promise<{ token: string }> {
    const { email, password } = loginDto;
    
    const user = await this.userModel.findOne({email}).select('+password');
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if(!isPasswordMatched || !user) {
        throw new UnauthorizedException('User not authorized');
    }

    const token = await APIFeatures.assignJwtToken(user.id, this.jwtService)

    return { token };
}



}