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
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { SongService } from './song.service';

@Controller('song')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createSongDto: CreateSongDto,
    @CurrectUser() userId: string,
  ) {
    return this.songService.create(createSongDto, userId);
  }

  @Post('/playlist')
  @UseGuards(AuthGuard)
  async addSongToPlaylist(
    @Body() dto: { songId: string; playlistId: string },
    @CurrectUser() userId: string,
  ) {
    return this.songService.addSongToPlaylist(dto, userId);
  }

  @Post('/like/:id')
  @UseGuards(AuthGuard)
  async likeSong(@Param('id') id: string, @CurrectUser() userId: string) {
    return this.songService.like(userId, id);
  }

  @Get()
  async findAll() {
    return this.songService.findAll();
  }

  @Get('/likes')
  @UseGuards(AuthGuard)
  async findLikes(@CurrectUser() userId: string) {
    return this.songService.findLikes(userId);
  }

  @Get('/singles')
  async singleSongs() {
    return this.songService.singleSongs();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.songService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateSongDto: UpdateSongDto,
    @CurrectUser() userId: string,
  ) {
    return this.songService.update(id, updateSongDto, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string, @CurrectUser() userId: string) {
    return this.songService.remove(id, userId);
  }
}
