import { defaultEntryDate, defaultResignDate } from '@/utils/constants';
import type { ProColumns } from '@ant-design/pro-table';
import moment from 'moment';
import type { Moment } from 'moment';
import { InputNumber } from 'antd';

export function genDateCol(date: Moment) {
  return {
    title: date.format('YY-MMM'),
    dataIndex: date.format(),
    width: 69,
    ellipsis: true,
    renderFormItem: () => {
      return (
        <InputNumber
          style={{ width: 60 }}
          size="small"
          min={0.0}
          max={1.0}
          step={0.1}
          precision={2}
          bordered={false}
        />
      );
    },
  };
}

export function genDateColsFromYearsMonths(start: Moment, end: Moment): ProColumns[] {
  const dateCols: ProColumns[] = [];
  if (start.year() == end.year()) {
    for (let i = start.month(); i <= end.month(); i++) {
      dateCols.push(genDateCol(moment([start.year(), i])));
    }
  } else {
    // add left months in start year
    for (let i = start.month(); i < 12; i++) {
      dateCols.push(genDateCol(moment([start.year(), i])));
    }
    // add all months between start year and end year
    for (let i = start.year() + 1; i < end.year(); i++) {
      for (let j = 0; j < 12; j++) {
        dateCols.push(genDateCol(moment([i, j])));
      }
    }
    // add left months in end year
    for (let i = 0; i <= end.month(); i++) {
      dateCols.push(genDateCol(moment([end.year(), i])));
    }
  }

  return dateCols;
}

export const genTableCols = (
  colStart: Moment,
  colEnd: Moment,
  commonColumns: ProColumns<Record<string, any>>[],
  entryDateStr?: string,
  resignDateStr?: string,
): ProColumns<Record<string, any>>[] => {
  const entryDate = moment(entryDateStr ? entryDateStr : defaultEntryDate);
  const resignDate = moment(resignDateStr ? resignDateStr : defaultResignDate);
  const start = colStart.isAfter(entryDate) ? colStart : entryDate;
  const end = colEnd.isAfter(resignDate) ? resignDate : colEnd;
  const columns = [...commonColumns];
  const dateCols = genDateColsFromYearsMonths(start, end);
  columns.splice(3, 0, ...dateCols);
  return columns;
};

export function filterDates(record: Record<string, any>) {
  return Object.keys(record).filter((key) => key.includes('-') && !key.includes('id'));
}

export function sumDateCols(
  columns: ProColumns<Record<string, any>>[],
  records: readonly Record<string, any>[],
) {
  const sumMap = new Map();
  columns.forEach((column) => sumMap.set(column.dataIndex, 0));
  records.forEach((record) => {
    const dates = filterDates(record);
    dates.forEach((date) => {
      if (sumMap.has(date)) {
        if (record[date]) {
          sumMap.set(date, sumMap.get(date) + record[date]);
        }
      }
    });
  });
  for (const [k] of sumMap) {
    sumMap.set(k, Number(Number(sumMap.get(k)).toFixed(1)));
  }
  return sumMap;
}

export function sumTotal(records: readonly Record<string, any>[]) {
  let total = 0;
  records.forEach((record) => {
    if (record.total) {
      total += record.total;
    }
  });
  total = Number(Number(total).toFixed(1));
  return total;
}
