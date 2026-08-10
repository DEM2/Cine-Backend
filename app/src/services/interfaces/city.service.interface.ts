// app/src/services/interfaces/city.service.interface.ts

import { CityResponseDto } from "../../dto/city-response.dto";

export interface ICityService {

    findByDepartmentId(departmentId: number): Promise<CityResponseDto[]>;

}