import request from 'umi-request';
import { getFakeChartData } from './_mock';

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function fakeChartData2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(getFakeChartData);
    }, 800);
  });
}
