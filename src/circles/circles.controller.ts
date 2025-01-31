import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CirclesService } from './circles.service';
import { CreateCircleDto, UpdateCircleDto } from './dto/circle.dto';
import { AddMemberDto } from './dto/member.dto';

@Controller('circles')
export class CirclesController {
  constructor(private readonly circlesService: CirclesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createCircleDto: CreateCircleDto) {
    return this.circlesService.createCircle(createCircleDto);
  }

  @Get()
  async findAll() {
    return this.circlesService.getAllCircles();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.circlesService.getCircleById(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Param('id') id: string, @Body() updateCircleDto: UpdateCircleDto) {
    return this.circlesService.updateCircle(id, updateCircleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.circlesService.deleteCircle(id);
  }

  @Post(':id/members')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async addMember(
    @Param('id') circleId: string, // Circle ID from the URL
    @Body() addMemberDto: AddMemberDto // Member details from the body
  ) {
    return this.circlesService.addMemberToCircle(circleId, addMemberDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT) // Sets the response status to 204 No Content
  @Delete(':circleId/members/:memberId')
  async removeMember(
    @Param('circleId') circleId: string, // Circle ID from the URL
    @Param('memberId') memberId: string // Member ID from the URL
  ) {
    await this.circlesService.removeMemberFromCircle(circleId, memberId);
  }
}
