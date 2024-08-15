import { IsArray, IsDateString, IsMilitaryTime, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreateSongDTO {

    @IsString()
    @IsNotEmpty()
    readonly title: string;
    
    @IsNotEmpty()
    @IsArray()
    @IsNumber({}, {each: true})
    readonly artists;
    
    
    @IsNotEmpty()
    @IsDateString()
    readonly releaseDate: Date;
    
    @IsMilitaryTime()
    @IsNotEmpty()
    readonly duration: Date;

    @IsString()
    @IsOptional()
    readonly lyrics: string;
}