export {};

declare global {
  type ChartData = Array<{
    id: string | number;
    data: Array<{
      x: number | string | Date;
      y: number | string | Date;
    }>;
  }>;
}
