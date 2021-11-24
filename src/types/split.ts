// 'app.component': { title: '', description: '' }
export interface IKeysList {
  [key: string]: {
    [key: string]: string
  }
}

export interface IArguments {
  acf: string
  lp: string
  fnc: string
}

export type FilenameCase = 'dotCase' | 'paramCase'
