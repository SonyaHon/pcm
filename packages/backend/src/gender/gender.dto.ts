export class CreateGenderDTO {
  name: string;
}

export class GetGenderDTO {
  id: string;
}

export type CreateOrGetGenderDTO = CreateGenderDTO | GetGenderDTO;
