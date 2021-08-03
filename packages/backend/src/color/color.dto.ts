export class CreateColorDTO {
  name: string;
}

export class GetColorDTO {
  id: string;
}

export type CreateOrGetColorDTO = CreateColorDTO | GetColorDTO;
