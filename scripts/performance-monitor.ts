
#!/usr/bin/env npx tsx

import { performance, PerformanceObserver } from 'perf_hooks';
import { cpuUsage, memoryUsage } from 'process';

class PerformanceMonitor {
  private metrics: {
    requests: number;
    totalResponseTime: number;
    memoryPeak: number;
    cpuPeak: number;
    errors: number;
  } = {
    requests: 0,
    totalResponseTime: 0,
    memoryPeak: 0,
    cpuPeak: 0,
    errors: 0
  };

  private startTime = Date.now();
  private observer: PerformanceObserver;

  constructor() {
    this.observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name.includes('api-request')) {
          this.metrics.requests++;
          this.metrics.totalResponseTime += entry.duration;
        }
      });
    });

    this.observer.observe({ entryTypes: ['measure'] });
    this.startMonitoring();
  }

  private startMonitoring() {
    // Monitor every 5 seconds
    setInterval(() => {
      const memory = memoryUsage();
      const cpu = cpuUsage();
      
      this.metrics.memoryPeak = Math.max(this.metrics.memoryPeak, memory.heapUsed);
      this.metrics.cpuPeak = Math.max(this.metrics.cpuPeak, cpu.user + cpu.system);

      this.logCurrentMetrics();
    }, 5000);
  }

  public markRequestStart(requestId: string) {
    performance.mark(`${requestId}-start`);
  }

  public markRequestEnd(requestId: string, isError = false) {
    performance.mark(`${requestId}-end`);
    performance.measure(`api-request-${requestId}`, `${requestId}-start`, `${requestId}-end`);
    
    if (isError) {
      this.metrics.errors++;
    }
  }

  private logCurrentMetrics() {
    const runtime = (Date.now() - this.startTime) / 1000;
    const avgResponseTime = this.metrics.requests > 0 
      ? this.metrics.totalResponseTime / this.metrics.requests 
      : 0;
    
    const throughput = this.metrics.requests / runtime;
    const errorRate = this.metrics.requests > 0 
      ? (this.metrics.errors / this.metrics.requests) * 100 
      : 0;

    console.log('\n📊 Performance Metrics:');
    console.log(`Runtime: ${runtime.toFixed(2)}s`);
    console.log(`Requests: ${this.metrics.requests}`);
    console.log(`Throughput: ${throughput.toFixed(2)} req/s`);
    console.log(`Avg Response Time: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`Error Rate: ${errorRate.toFixed(2)}%`);
    console.log(`Memory Peak: ${(this.metrics.memoryPeak / 1024 / 1024).toFixed(2)}MB`);
    console.log(`CPU Peak: ${(this.metrics.cpuPeak / 1000000).toFixed(2)}s`);
  }

  public getReport() {
    const runtime = (Date.now() - this.startTime) / 1000;
    const avgResponseTime = this.metrics.requests > 0 
      ? this.metrics.totalResponseTime / this.metrics.requests 
      : 0;
    
    return {
      runtime,
      totalRequests: this.metrics.requests,
      throughput: this.metrics.requests / runtime,
      averageResponseTime: avgResponseTime,
      errorRate: this.metrics.requests > 0 
        ? (this.metrics.errors / this.metrics.requests) * 100 
        : 0,
      memoryPeakMB: this.metrics.memoryPeak / 1024 / 1024,
      cpuPeakSeconds: this.metrics.cpuPeak / 1000000
    };
  }

  public stop() {
    this.observer.disconnect();
    return this.getReport();
  }
}

// Export for use in server
export default PerformanceMonitor;

// CLI usage
if (require.main === module) {
  console.log('🚀 Performance Monitor Started');
  console.log('Press Ctrl+C to stop and get final report\n');
  
  const monitor = new PerformanceMonitor();
  
  process.on('SIGINT', () => {
    console.log('\n\n📋 Final Performance Report:');
    const report = monitor.stop();
    console.table(report);
    process.exit(0);
  });
}
