import { BadRequestException, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import {
  ActivationResponse,
  ForgotPasswordResponse,
  LoginResponse,
  LogoutResponse,
  RegisterResponse,
} from './types/user.types';
import { ActivationDto, ForgotPassDto, RegisterDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { Response } from 'express';
import { AuthGuard } from './guards/auth.guard';

@Resolver('User')
// @UseFilters()
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerDto') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    if (!registerDto.name || !registerDto.email || !registerDto.password) {
      throw new BadRequestException('Please fill all the required fields');
    }

    const { activation_token } = (await this.userService.register(
      registerDto,
      context.res,
    )) as any;

    return { activation_token };
  }

  @Mutation(() => ActivationResponse)
  async activateUser(
    @Args('activationDto') activationDto: ActivationDto,
    @Context() context: { res: Response },
  ): Promise<ActivationResponse> {
    return await this.userService.activateUser(activationDto, context.res);
  }

  @Mutation(() => LoginResponse)
  async Login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    return await this.userService.Login({ email, password });
  }

  // @Query(() =>LoginResponse)
  // @UseGuards(AuthGuard)
  // async getLoggedInUser(@Context() context:{req:Request}){
  //     return await this.userService.getLoggedInUser(context.req);
  // }

  // Get logged-in user query
  @Query(() => LoginResponse)
  @UseGuards(AuthGuard)
  async getLoggedInUser(@Context() context: { req: any }) {
    return await this.userService.getLoggedInUser(context.req);
  }

  @Query(() => ForgotPasswordResponse)
 
  async forgotPassword(
    @Args('forgotPasswordDto')forgotPassDto:ForgotPassDto,
    ):Promise<ForgotPasswordResponse> {
    return await this.userService.forgotPassword(forgotPassDto);
  }


  @Query(() => LogoutResponse)
  @UseGuards(AuthGuard)
  async LogOutUser(@Context() context:{req:Request}){
    return await this.userService.Logout(context.req);
  }

  @Query(() => [User])
  async getUsers() {
    return this.userService.getUsers();
  }
}
