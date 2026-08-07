export interface IOrganizationTypeResponse {
  id: number
  name: string
}

export interface IOrganizationResponse {
  id: number
  parentOrganizationUnit: Pick<IOrganizationResponse, 'id'>
  code: string
  name: string
  type: IOrganizationTypeResponse
}
