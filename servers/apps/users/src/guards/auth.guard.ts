// import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";
// import { PrismaService } from "../../../../prisma/prisma.service";
// import { ConfigService } from "@nestjs/config";
// import { GqlExecutionContext } from "@nestjs/graphql";

// @Injectable()
// export class AuthGuard implements CanActivate{
//     constructor(
//         private readonly jwtService:JwtService,
//         private readonly prisma: PrismaService,
//         private readonly config: ConfigService,
//     ){}

//     async canActivate(context:ExecutionContext):Promise<boolean>{
//         const gqlContext = GqlExecutionContext.create(context);

//         const {req} = gqlContext.getContext();
//         console.log(req.headers)

//         const accessToken = req.headers.accesstoken as string;
//         const refreshToken = req.headers.refreshtoken as string;

//         if(!accessToken || !refreshToken){
//             throw new UnauthorizedException('Please login to access this resource')
//         }

//         if(accessToken){
//             const decoded = this.jwtService.verify(accessToken,{
//                 secret:this.config.get<string>('ACCESS_TOKEN_SECRET'),
//             });

//             if(!decoded){
//                 throw new UnauthorizedException('Invalid Access Token')
//             }

//             await this.updateAccessToken(req);
//         }

//         return true;

//     }
//     private async updateAccessToken(req:any):Promise<void>{
//         try{
//             const refreshTokenData = req.headers.refreshToken as string;
//             const decoded = this.jwtService.verify(refreshTokenData,{
//                 secret:this.config.get<string>('REFRESH_TOKEN_SECRET'),
//             });

//             if(!decoded){
//                 throw new UnauthorizedException('Invalid refresh Token')
//             }

//             const user = await this.prisma.user.findUnique({
//                 where:{
//                     id: decoded.id,
//                 }
//             });

//             const accessToken = this.jwtService.sign(
//                 {
//                     id:user.id
//                 },
//                 {
//                     secret:this.config.get<string>('ACCESS_TOKEN_SECRET'),
//                 expiresIn:'15m',                
//             },
//             );


//             const refreshToken = this.jwtService.sign(
//                 {
//                     id:user.id
//                 },
//                 {
//                     secret:this.config.get<string>('REFRESH_TOKEN_SECRET'),
//                 expiresIn:'7d',                
//             },
//             );

//             req.accessToken = accessToken;
//             req.refreshToken = refreshToken;
//             req.user = user;

            
//         }catch(error){
//             console.log(error)

//         }
//     }
//     // async canActivate(context: ExecutionContext): Promise<boolean> {
//     //     const gqlContext = GqlExecutionContext.create(context);
//     //     const { req } = gqlContext.getContext();
      
//     //     // Check if tokens are present in headers
//     //     const accessToken = req.headers.accessToken as string;
//     //     const refreshToken = req.headers.refreshToken as string;
      
//     //     console.log("AccessToken:", accessToken);
//     //     console.log("RefreshToken:", refreshToken);
      
//     //     if (!accessToken || !refreshToken) {
//     //       throw new UnauthorizedException('Please login to access this resource');
//     //     }
      
//     //     if (accessToken) {
//     //       try {
//     //         // Validate the access token
//     //         const decoded = this.jwtService.verify(accessToken, {
//     //           secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
//     //         });
      
//     //         console.log("AccessToken Decoded:", decoded);
      
//     //         if (!decoded) {
//     //           throw new UnauthorizedException('Invalid Access Token');
//     //         }
      
//     //         await this.updateAccessToken(req);
//     //       } catch (error) {
//     //         console.error("AccessToken Validation Error:", error);
//     //         throw new UnauthorizedException('Invalid Access Token');
//     //       }
//     //     }
      
//     //     return true;
//     //   }

//     //   private async updateAccessToken(req: any): Promise<void> {
//     //     try {
//     //       const refreshTokenData = req.headers.refreshToken as string;
      
//     //       console.log("RefreshToken for updating access token:", refreshTokenData);
      
//     //       const decoded = this.jwtService.verify(refreshTokenData, {
//     //         secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
//     //       });
      
//     //       console.log("Decoded RefreshToken:", decoded);
      
//     //       if (!decoded) {
//     //         throw new UnauthorizedException('Invalid refresh Token');
//     //       }
      
//     //       const user = await this.prisma.user.findUnique({
//     //         where: {
//     //           id: decoded.id,
//     //         },
//     //       });
      
//     //       const accessToken = this.jwtService.sign(
//     //         { id: user.id },
//     //         {
//     //           secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
//     //           expiresIn: '15m',
//     //         }
//     //       );
      
//     //       const refreshToken = this.jwtService.sign(
//     //         { id: user.id },
//     //         {
//     //           secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
//     //           expiresIn: '7d',
//     //         }
//     //       );
      
//     //       req.accessToken = accessToken;
//     //       req.refreshToken = refreshToken;
//     //       req.user = user;
      
//     //       console.log("New AccessToken:", accessToken);
//     //       console.log("New RefreshToken:", refreshToken);
//     //     } catch (error) {
//     //       console.error("Refresh Token Validation Error:", error);
//     //     }
//     //   }
      
      
// }

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../../../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  // Main logic to validate and verify tokens
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const contextData = gqlContext.getContext();
    const { req } = contextData;

    // Log the entire context to understand the structure
    // console.log("GraphQL Context:", contextData);
    // console.log("Request Object:", req);

    // Retrieve accessToken and refreshToken from the headers
    const accessToken = req.headers['accesstoken'] as string;
    const refreshToken = req.headers['refreshtoken'] as string;

    // Log the tokens to ensure they are being passed
    // console.log("AccessToken:", accessToken);
    // console.log("RefreshToken:", refreshToken);

    // If tokens are missing, throw an UnauthorizedException
    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException('Please login to access this resource');
    }

    // Validate Access Token
    if (accessToken) {
      try {
        const decoded = this.jwtService.verify(accessToken, {
          secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
        });

        //console.log("AccessToken Decoded:", decoded);

        if (!decoded) {
          throw new UnauthorizedException('Invalid Access Token');
        }

        // Proceed to update the access token if valid
        await this.updateAccessToken(req);
      } catch (error) {
        console.error("AccessToken Validation Error:", error);
        throw new UnauthorizedException('Invalid Access Token');
      }
    }

    return true;
  }

  // Method to update the access token based on the refresh token
  private async updateAccessToken(req: any): Promise<void> {
    try {
      const refreshTokenData = req.headers['refreshtoken'] as string;

      //console.log("RefreshToken for updating access token:", refreshTokenData);

      const decoded = this.jwtService.verify(refreshTokenData, {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
      });

      //console.log("Decoded RefreshToken:", decoded);

      if (!decoded) {
        throw new UnauthorizedException('Invalid refresh Token');
      }

      // Get user details from the database using the decoded refresh token
      const user = await this.prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
      });

      // Create new access and refresh tokens for the user
      const accessToken = this.jwtService.sign(
        { id: user.id },
        {
          secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: '15m',
        }
      );

      const refreshToken = this.jwtService.sign(
        { id: user.id },
        {
          secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: '7d',
        }
      );

      // Attach the new tokens and user to the request
      req.accesstoken = accessToken;
      req.refreshtoken = refreshToken;
      req.user = user;

    //   console.log("New AccessToken:", accessToken);
    //   console.log("New RefreshToken:", refreshToken);
    } catch (error) {
      console.error("Refresh Token Validation Error:", error);
    }
  }
}
