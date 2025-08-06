import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrectUser } from 'src/common/decorators/userCurrect.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AlbumService } from './album.service';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}


  @Get('/likes')
  @UseGuards(AuthGuard)
  async findLikes(@CurrectUser() userId: string) {
    return this.albumService.findLikes(userId);
  }


  
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.albumService.findOne({ albumId: id });
  }

  
  @Get()
  async find() {
    return this.albumService.find();
  }

  @Get('/profile/:id')
  async getProfilePlaylist(@Param('id') id: string) {
    return this.albumService.getProfileAlbum(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() body: CreateAlbumDto, @CurrectUser() userId: string) {
    return this.albumService.create(body, userId);
  }
  @Post('/like/:id')
  @UseGuards(AuthGuard)
  async like(@Param('id') id: string, @CurrectUser() userId: string) {
    return this.albumService.like({ albumId: id }, userId);
  }
  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() body: Omit<UpdateAlbumDto, 'albumId'>,
    @CurrectUser() userId: string,
  ) {
    return this.albumService.update({ ...body, albumId: id }, userId);
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string, @CurrectUser() userId: string) {
    return this.albumService.delete({ albumId: id }, userId);
  }
}
