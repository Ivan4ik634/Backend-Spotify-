export class CreateSongDto {
  name: string;

  songUrl: string;

  coverUrl: string;

  album?: string;

  duration: number;
}
