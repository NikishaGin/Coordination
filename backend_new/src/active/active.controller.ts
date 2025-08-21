import { Controller } from '@nestjs/common';
import { ActiveService } from './active.service';

@Controller('actives')
export class ActiveController {
  constructor(private readonly activeService: ActiveService) {}
}
