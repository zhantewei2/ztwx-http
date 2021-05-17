export const DEFAULT_PRIORITY = 0;
export interface PriorityHeaderItem {
  key: string;
  value: any;
  priority?: number; // default 0;
}

export type PriorityHeaderRecord = Record<
  string,
  { value: any; priority: number }
>;

export class PriorityHeaders {
  data: PriorityHeaderRecord = {};
  constructor(
    headers: Record<string, any>,
    mergePriorityHeaders?: PriorityHeaderRecord,
  ) {
    const priorityHeader: PriorityHeaderRecord = {};
    for (const i in headers) {
      priorityHeader[i] = {
        value: headers[i],
        priority: DEFAULT_PRIORITY,
      };
    }
    this.data = !mergePriorityHeaders
      ? priorityHeader
      : Object.assign(priorityHeader, mergePriorityHeaders);
  }
  addType(content: string) {
    this.add({ key: "Content-Type", value: content }, false);
  }
  add(item: PriorityHeaderItem, override = true) {
    if (!override && this.data[item.key]) return;
    this.data[item.key] = {
      value: item.value,
      priority: item.priority || DEFAULT_PRIORITY,
    };
  }
  combineToRecord(
    data: PriorityHeaderRecord,
    data2: PriorityHeaderRecord,
  ): Record<string, any> {
    const combineRecord: Record<string, any> = {};
    new Set(Object.keys(data).concat(Object.keys(data2))).forEach((key) => {
      combineRecord[key] = !data[key]
        ? data2[key].value
        : !data2[key]
        ? data[key].value
        : data[key].priority >= data2[key].priority
        ? data[key].value
        : data2[key].value;
    });
    return combineRecord;
  }
}
