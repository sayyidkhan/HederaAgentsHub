/**
 * DataAnalyzerAgent - Example agent that analyzes data
 */

import { BaseAgent } from './BaseAgent';

export interface AnalysisRequest {
  data: number[];
  analysisType: 'mean' | 'median' | 'sum' | 'stats';
}

export interface AnalysisResponse {
  analysisType: string;
  result: any;
  dataPoints: number;
  timestamp: number;
}

export class DataAnalyzerAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Data Analyzer',
      description: 'Analyzes and processes numerical data',
      capabilities: ['data-analysis', 'statistics', 'ml-inference', 'reporting'],
      serviceUrl: 'http://localhost:3002',
      price: 0.05,
      currency: 'USDC',
    });
  }

  /**
   * Perform data analysis service
   */
  async performService(input: AnalysisRequest): Promise<AnalysisResponse> {
    console.log(`📊 Processing ${input.analysisType} analysis`);

    let result: any;

    switch (input.analysisType) {
      case 'mean':
        result = this.calculateMean(input.data);
        break;
      case 'median':
        result = this.calculateMedian(input.data);
        break;
      case 'sum':
        result = this.calculateSum(input.data);
        break;
      case 'stats':
        result = this.calculateStats(input.data);
        break;
      default:
        throw new Error(`Unknown analysis type: ${input.analysisType}`);
    }

    console.log(`✅ Analysis complete: ${input.analysisType}`);

    return {
      analysisType: input.analysisType,
      result,
      dataPoints: input.data.length,
      timestamp: Date.now(),
    };
  }

  // ========================================================================
  // ANALYSIS METHODS
  // ========================================================================

  private calculateMean(data: number[]): number {
    return data.reduce((a, b) => a + b, 0) / data.length;
  }

  private calculateMedian(data: number[]): number {
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  private calculateSum(data: number[]): number {
    return data.reduce((a, b) => a + b, 0);
  }

  private calculateStats(data: number[]): any {
    const mean = this.calculateMean(data);
    const median = this.calculateMedian(data);
    const sum = this.calculateSum(data);
    const min = Math.min(...data);
    const max = Math.max(...data);

    return {
      mean,
      median,
      sum,
      min,
      max,
      count: data.length,
    };
  }

  /**
   * Quick analysis methods
   */
  async analyzeMean(data: number[]): Promise<number> {
    const result = await this.performService({ data, analysisType: 'mean' });
    return result.result;
  }

  async analyzeStats(data: number[]): Promise<any> {
    const result = await this.performService({ data, analysisType: 'stats' });
    return result.result;
  }
}

export default DataAnalyzerAgent;
