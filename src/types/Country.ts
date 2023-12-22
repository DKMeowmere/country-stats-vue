export type Country = {
	name: {
		common: string
		official: string
		nativeName?: {
			[key: string]: {
				common: string
				official: string
			}
		}
	}
	cca3: string
	independent: boolean
	unMember: boolean
  landlocked: boolean
	capital?: string[]
	currencies?: { name: string; symbol: string }[]
	languages?: { [key: string]: string }
  region: string
  subregion?: string
	flag: string
	flags: {
		png: string
		svg: string
		alt: string
	}
	coatOfArms: {
		png: string
		svg: string
	}
  borders?: string[]
}
