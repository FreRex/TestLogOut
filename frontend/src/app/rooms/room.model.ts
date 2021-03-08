export class Room {
    constructor(
        public id: number,
        public usermobile: string,
        public nome_progetto: string,
        public nome_collaudatore: string,
        public data_inserimento: Date,
        public pk_project?: number,
        public commessa?: string,
        ) { };
}