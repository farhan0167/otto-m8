
type BlockFieldType = {
    name: string,
    display_name: string,
    default_value: any,
    type: string,
    is_run_config: boolean,
    show_in_ui: boolean
}

type BlockFields = BlockFieldType[]

export type { BlockFieldType , BlockFields }