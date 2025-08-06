import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AlbumSchema } from 'src/schemes/Album.scheme';
import { UserSchema } from 'src/schemes/User.scheme';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Album', schema: AlbumSchema }]),
  ],
  controllers: [AlbumController],
  providers: [AlbumService, JwtService],
})
export class AlbumModule {}
