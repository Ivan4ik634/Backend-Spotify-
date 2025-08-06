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
import { CreatePlayListDto, UpdatePlayListDto } from './dto';
import { PlaylistService } from './playlist.service';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Get('/likes')
  @UseGuards(AuthGuard)
  async findLikes(@CurrectUser() userId: string) {
    return this.playlistService.findLikes(userId);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.playlistService.findOne({ playlistId: id });
  }
  @Get()
  async find() {
    return this.playlistService.find();
  }
  @Get('/profile/:id')
  async getProfilePlaylist(@Param('id') id: string) {
    return this.playlistService.getProfilePlaylist(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() body: CreatePlayListDto, @CurrectUser() userId: string) {
    return this.playlistService.create(body, userId);
  }
  @Post('/like/:id')
  @UseGuards(AuthGuard)
  async like(@Param('id') id: string, @CurrectUser() userId: string) {
    return this.playlistService.like({ playlistId: id }, userId);
  }
  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() body: Omit<UpdatePlayListDto, 'albumId'>,
    @CurrectUser() userId: string,
  ) {
    return this.playlistService.update({ ...body, playlistId: id }, userId);
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string, @CurrectUser() userId: string) {
    return this.playlistService.delete({ playlistId: id }, userId);
  }
}
