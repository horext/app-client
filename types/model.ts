
export class User {
    id!: Number
    // eslint-disable-next-line no-use-before-define
    speciality: Speciality = new Speciality()
    courses: Course[] = []
}

export class Course {
    private _id!: number
    private _code!: string
    private _name!: string
    private _sections!: Array<Section>

    get sections (): Array<Section> {
      return this._sections
    }

    set sections (value: Array<Section>) {
      this._sections = value
    }

    get id (): number {
      return this._id
    }

    set id (value: number) {
      this._id = value
    }

    get code (): string {
      return this._code
    }

    set code (value: string) {
      this._code = value
    }

    get name (): string {
      return this._name
    }

    set name (value: string) {
      this._name = value
    }
}

export class Section {
  id!: number
    code!: string
}

export class Faculty {
  private _id!: number
  private _code!: string
  private _name!: string

  get id (): number {
    return this._id
  }

  set id (value: number) {
    this._id = value
  }

  get code (): string {
    return this._code
  }

  set code (value: string) {
    this._code = value
  }

  get name (): string {
    return this._name
  }

  set name (value: string) {
    this._name = value
  }
}

export class Speciality {
    private _id!: number
    private _code!: string
    private _name!: string
    private _faculty: Faculty = new Faculty()

    get id (): number {
      return this._id
    }

    set id (value: number) {
      this._id = value
    }

    get code (): string {
      return this._code
    }

    set code (value: string) {
      this._code = value
    }

    get name (): string {
      return this._name
    }

    set name (value: string) {
      this._name = value
    }

    get faculty (): Faculty {
      return this._faculty
    }

    set faculty (value: Faculty) {
      this._faculty = value
    }
}
