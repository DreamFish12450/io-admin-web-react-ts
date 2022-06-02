export interface ILoginSubmit {
  id: number
  password: string
}

export interface ICaptcha {
  image: string
  key: string
}

export interface IBuildNode {
  label: string
  left?: IBuildNode
  right?: IBuildNode
  checked?: boolean
  id?:string
  fatherId?:string
}
