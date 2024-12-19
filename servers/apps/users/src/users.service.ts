import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
//import { Response } from 'express';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { Response } from 'express';
import bcrypt from "bcryptjs"
import { EmailService } from './email/email.service';



interface UserData {
  name: string;
  email: String;
  password: string;
  phone_number: number;
}


@Injectable()
export class UsersService {
 constructor(
  private readonly jwtService:JwtService,
  private readonly prisma:PrismaService,
  private readonly  configService:ConfigService,
  // private readonly emailService:EmailService,
  private readonly emailService:EmailService,

 ){}

 //register user service
 async register(registerDto: RegisterDto, response:Response){
  const {name, email, password,phone_number } = registerDto;


  const isEmailExist = await this.prisma.user.findUnique({where:{
    email,
  }});

  if(isEmailExist){
    throw new BadRequestException("user already exist with this email");
  }

  const isPhoneExists=await this.prisma.user.findUnique({
    where:{
      phone_number,
    }
  })
  if(isPhoneExists){
    throw new BadRequestException("user already exists with this phone number")
  }

  //hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = {
      name,
      email,
      password:hashedPassword,
      phone_number,
  
  };

  const activationToken = await this.createActivationToken(user);

  const activationCode = activationToken.activationCode

  // await this.emailService.sendMail({
  //   email,
  //   subject:"Activate your account",
  //   template:"./activation-mail",
  //   name,
  //   activationCode,
  // })

  

  return {user, response}
 }


 //create activation and token
 async createActivationToken(user:UserData){
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString()
  
  const token = this.jwtService.sign({
    user,
    activationCode,
  },{
    secret: this.configService.get<string>("ACTIVATION_SECRET"),
    expiresIn: '5m',
  });
  return {token, activationCode}

 }





 //login service
 async Login(loginDto:LoginDto){
  const {email, password} = loginDto;

  const user = {
    email,
    password
  };
  return user;
 }

 //get all userservicr
 async getUsers(){
  return this.prisma.user.findMany({})
  
 }


}
