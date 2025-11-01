/**
 * WeatherAgent - Example agent that provides weather data
 */

import { BaseAgent } from './BaseAgent';

export interface WeatherRequest {
  location: string;
  type: 'current' | 'forecast';
}

export interface WeatherResponse {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  timestamp: number;
}

export class WeatherAgent extends BaseAgent {
  constructor() {
    super({
      name: 'Weather Bot',
      description: 'Provides real-time weather data and forecasts',
      capabilities: ['weather', 'forecast', 'alerts'],
      serviceUrl: 'http://localhost:3001',
      price: 0.01,
      currency: 'USDC',
    });
  }

  /**
   * Perform weather service
   */
  async performService(input: WeatherRequest): Promise<WeatherResponse> {
    console.log(`🌤️  Processing weather request for ${input.location}`);

    // Simulate weather data (in production, call real API)
    const weatherData: WeatherResponse = {
      location: input.location,
      temperature: Math.floor(Math.random() * 30) + 15, // 15-45°C
      condition: ['Sunny', 'Cloudy', 'Rainy', 'Windy'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 60) + 40, // 40-100%
      timestamp: Date.now(),
    };

    console.log(`✅ Weather data retrieved for ${input.location}`);
    return weatherData;
  }

  /**
   * Get current weather
   */
  async getCurrentWeather(location: string): Promise<WeatherResponse> {
    return this.performService({ location, type: 'current' });
  }

  /**
   * Get forecast
   */
  async getForecast(location: string): Promise<WeatherResponse> {
    return this.performService({ location, type: 'forecast' });
  }
}

export default WeatherAgent;
