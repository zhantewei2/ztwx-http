export declare const DEFAULT_PRIORITY = 0;
export interface PriorityHeaderItem {
    key: string;
    value: any;
    priority?: number;
}
export declare type PriorityHeaderRecord = Record<string, {
    value: any;
    priority: number;
}>;
export declare class PriorityHeaders {
    data: PriorityHeaderRecord;
    constructor(headers: Record<string, any>, mergePriorityHeaders?: PriorityHeaderRecord);
    addType(content: string): void;
    add(item: PriorityHeaderItem, override?: boolean): void;
    combineToRecord(data: PriorityHeaderRecord, data2: PriorityHeaderRecord): Record<string, any>;
}
