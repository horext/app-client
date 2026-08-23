export interface IOrganizationType {
  id: number
  name: string
}

export interface IOrganizationReference {
  id: number
}

export interface IOrganization extends IOrganizationReference {
  parentOrganizationUnit: IOrganizationReference
  code: string
  name: string
  type: IOrganizationType
}
