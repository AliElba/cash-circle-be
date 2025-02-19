import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CirclesService } from './circles.service';
import { CreateCircleDto, UpdateCircleDto } from './dto/circle.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Circle } from '@prisma/client';
import { CirclePayload } from './payload/circle.payload';
import { MemberDto } from './dto/member.dto';

@Controller('circles')
export class CirclesController {
  constructor(private readonly circlesService: CirclesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiResponse({ description: 'Create Circles', type: CirclePayload })
  async create(@Body() createCircleDto: CreateCircleDto): Promise<Circle> {
    return this.circlesService.createCircle(createCircleDto);
  }

  @Get()
  @ApiResponse({ description: 'Get all Circles', type: [CirclePayload] })
  async findAll() {
    return this.circlesService.getAllCircles();
  }

  @Get(':id')
  @ApiResponse({ description: 'Find Circle', type: CirclePayload })
  async findOne(@Param('id') id: string) {
    return this.circlesService.getCircleById(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiResponse({ description: 'Update Circle', type: CirclePayload })
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
    @Body() memberDto: MemberDto // Member details from the body
  ) {
    return this.circlesService.addMemberToCircle(circleId, memberDto);
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
