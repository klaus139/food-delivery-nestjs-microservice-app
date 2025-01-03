import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
//import { Response } from 'express';
import { ActivationDto, LoginDto, RegisterDto } from './dto/user.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { Response } from 'express';
import * as bcrypt from "bcrypt"

import { EmailService } from './email/email.service';
import { TokenSender } from './utils/sendToken';



interface UserData {
  name: string;
  email: string;
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
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
      name,
      email,
      password:hashedPassword,
      phone_number,
  
  };

  const activationToken = await this.createActivationToken(user);
  const { token, activationCode } = await this.createActivationToken(user);
  
  
  //const activationCode = token.split('.')[1];
  //const token = activationToken.token

  // const activationCode = activationToken.activationCode

  await this.emailService.sendMail({
    email,
    subject:"Activate your account",
    template:"./activation-mail",
    name,
    activationCode,
  })

  

  // return {activationToken, response}
  return { activation_token: token, response, activationCode };
 }


 //create activation and token
 async createActivationToken(user:UserData){
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  console.log('activode', activationCode);
  
  const token = this.jwtService.sign({
    user,
    activationCode,
  },{
    secret: this.configService.get<string>("ACTIVATION_SECRET"),
    expiresIn: '5m',
  });
  return {token, activationCode}

 }


//  async activateUser(activationDto:ActivationDto, response:Response){
//   const {activationCode, activationToken} = activationDto;
//   console.log('token',activationToken);

//   const newUser:{user:UserData, activationCode:string} = this.jwtService.verify(activationToken,{secret:this.configService.get<string>('ACTIVATION_SECRET')} as JwtVerifyOptions) as {user:UserData, activationCode:string};
// console.log('new',newUser)
//   //console.log(newUser);
//   if(newUser.activationCode !== activationCode){
//     throw new BadRequestException('Invalid activation code')
//   }

//   const {name, email, password, phone_number} = newUser.user;
  
//   const existingUser = await this.prisma.user.findUnique({
//     where: {
//       email,
//     },
//   })

//   if(existingUser){
//     throw new BadRequestException("user already exists with this email")
//   }

//   const user = await this.prisma.user.create({
//     data:{
//       name,
//       email,
//       password,
//       phone_number
//     }
//   });

//   return {user, response}

//  }

async activateUser(activationDto: ActivationDto, response: Response) {
  const { activationCode, activationToken } = activationDto;
  
  try {
    console.log('Received token:', activationToken);
    
    // Verify the JWT token
    const decoded = this.jwtService.verify(activationToken, {
      secret: this.configService.get<string>('ACTIVATION_SECRET'),
    });

    console.log('Decoded JWT:', decoded);

    // Destructure decoded payload
    const newUser: { user: UserData; activationCode: string } = decoded as { user: UserData; activationCode: string };

    // Compare activation codes
    if (newUser.activationCode !== activationCode) {
      throw new BadRequestException('Invalid activation code');
    }

    const { name, email, password, phone_number } = newUser.user;
    
    // Check if the user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists with this email');
    }

    // Create new user
    const user = await this.prisma.user.create({
      data: { name, email, password, phone_number },
    });

    // Return the user information
    return { user, response };
  } catch (error) {
    console.error('Error during user activation:', error);

    // Handle specific errors
    if (error instanceof JwtService ) {
      throw new BadRequestException('Invalid or expired activation token');
    }

    // If it's some other error (e.g., database issue), throw a generic server error
    throw new InternalServerErrorException('An error occurred while activating the user');
  }
}


 //login service
 async Login(loginDto:LoginDto){
  const {email, password} = loginDto;

  const user = await this.prisma.user.findUnique({
    where:{
      email,
    }
  })

  if(user && (await this.comparePassword(password, user.password))){

    const tokenSender = new TokenSender(this.configService, this.jwtService);
   return tokenSender.sendToken(user);
  }else {
    return {
      user:null,
      accessToken:null,
      refreshToken:null,
      error:{
        message:'Invalid email or password'
      }
    }
  }

  
 }

 //compare password

 async comparePassword(password:string, hashedPassword:string):Promise<boolean>{
  return await bcrypt.compare(password, hashedPassword);
 }

 //get loggedinjuser

//  async getLoggedInUser(req:any){
//   const user = req.user;
//   const refreshToken =req.refreshToken;
//   const accessToken =req.accessToken;

//   console.log(refreshToken)


//   console.log({user, refreshToken,accessToken})
//   return {user, refreshToken, accessToken}
//  }

async getLoggedInUser(req: any) {
  const user = req.user;
  const refreshToken = req.refreshtoken;
  const accessToken = req.accesstoken;

  
  // console.log({ user, 'refrsh':refreshToken, 'access':accessToken });

  return { user, refreshToken, accessToken };
}


//logout user
async Logout(req:any){
  req.user = null;
  req.refreshToken = null;
  req.accessToken = null;

  return {message:'Logged out successfully'}
}


 //get all userservicr
 async getUsers(){
  return this.prisma.user.findMany({})
  
 }


}
