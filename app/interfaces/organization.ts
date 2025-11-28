export interface IOrganizationType {
  id: number
  name: string
}

export interface IOrganization {
  id: number
  parentOrganizationUnit: {
    id: number
  }
  code: string
  name: string
  type: IOrganizationType
}
