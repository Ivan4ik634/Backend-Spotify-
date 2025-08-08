import { Controller } from '@nestjs/common';

@Controller('ping')
export class PingController {
  constructor() {}
  async Ping() {
    return 'pong';
  }
}
