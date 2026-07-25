# 📊 Log Visualization for Spring Boot Application

A comprehensive logging and monitoring solution for Spring Boot applications using Grafana Loki and Grafana. This project implements real-time log aggregation, visualization, and alerting to monitor application performance, error rates, and system health.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Dashboard Overview](#dashboard-overview)
- [Alerting](#alerting)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [Author](#author)

## 🎯 Overview

Modern applications generate thousands of logs per minute, making it challenging to monitor application health and debug issues. This project provides a complete observability stack that:

- Collects logs from Spring Boot applications in real-time
- Stores logs efficiently using Grafana Loki
- Visualizes logs through interactive Grafana dashboards
- Enables proactive detection of errors, performance bottlenecks, and anomalies
- Reduces mean time to detect (MTTD) and resolve (MTTR) incidents

## ✨ Features

- **Real-Time Log Collection**: Captures logs generated every 5 seconds from Spring Boot applications
- **Centralized Logging**: Aggregates logs from multiple services/instances
- **Interactive Dashboards**: 
  - Application performance metrics
  - Error rate tracking and trends
  - Log level distribution (INFO, WARN, ERROR, DEBUG)
  - System health monitoring
  - API endpoint performance
- **Custom Queries**: LogQL queries for filtering and analyzing specific log patterns
- **Alerting System**: Automated alerts for error spikes and anomalies
- **Log Retention**: Configurable retention policies for historical analysis
- **Scalable Architecture**: Can handle high-volume logging scenarios

## 🏗️ Architecture

```
┌─────────────────────┐
│  Spring Boot App    │
│  (Generates Logs)   │
└──────────┬──────────┘
           │
           │ Logs (JSON/Plain Text)
           ▼
┌─────────────────────┐
│     Promtail        │
│  (Log Aggregator)   │
└──────────┬──────────┘
           │
           │ Push Logs
           ▼
┌─────────────────────┐
│   Grafana Loki      │
│  (Log Storage)      │
└──────────┬──────────┘
           │
           │ Query Logs
           ▼
┌─────────────────────┐
│      Grafana        │
│  (Visualization)    │
└─────────────────────┘
```

## 🛠️ Technologies Used

- **Spring Boot 3.x** - Java application framework
- **Grafana Loki** - Log aggregation system
- **Promtail** - Log shipping agent
- **Grafana** - Visualization and analytics platform
- **Docker & Docker Compose** - Containerization
- **Logback/Log4j2** - Java logging framework

## 📋 Prerequisites

Before running this project, ensure you have:

- Java 17+ installed
- Docker and Docker Compose installed
- Maven or Gradle (for building Spring Boot app)
- Minimum 4GB RAM available
- Ports 3000 (Grafana), 3100 (Loki), 9080 (Promtail) available

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/log-visualization-springboot.git
cd log-visualization-springboot
```

### 2. Build the Spring Boot Application

```bash
cd spring-boot-app
mvn clean package
# OR with Gradle
./gradlew build
```

### 3. Start the Logging Stack

```bash
docker-compose up -d
```

This will start:
- Grafana (http://localhost:3000)
- Loki (http://localhost:3100)
- Promtail
- Spring Boot Application (http://localhost:8080)

### 4. Access Grafana

1. Open browser and navigate to `http://localhost:3000`
2. Default credentials:
   - Username: `admin`
   - Password: `admin` (you'll be prompted to change)

## ⚙️ Configuration

### Spring Boot Application Logging

**application.yml**
```yaml
logging:
  level:
    root: INFO
    com.yourpackage: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
  file:
    name: /var/log/spring-boot-app.log
```

### Promtail Configuration

**promtail-config.yml**
```yaml
server:
  http_listen_port: 9080

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: spring-boot-logs
    static_configs:
      - targets:
          - localhost
        labels:
          job: spring-boot
          app: your-app-name
          __path__: /var/log/spring-boot-app.log
```

### Loki Configuration

**loki-config.yml**
```yaml
auth_enabled: false

server:
  http_listen_port: 3100

ingester:
  lifecycler:
    ring:
      kvstore:
        store: inmemory
      replication_factor: 1
  chunk_idle_period: 5m
  chunk_retain_period: 30s

schema_config:
  configs:
    - from: 2023-01-01
      store: boltdb
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 168h

storage_config:
  boltdb:
    directory: /tmp/loki/index
  filesystem:
    directory: /tmp/loki/chunks

limits_config:
  enforce_metric_name: false
  reject_old_samples: true
  reject_old_samples_max_age: 168h

chunk_store_config:
  max_look_back_period: 0s

table_manager:
  retention_deletes_enabled: true
  retention_period: 168h
```

## 💻 Usage

### 1. Generate Logs

The Spring Boot application automatically generates logs every 5 seconds. You can also trigger specific log events:

```bash
# Generate INFO logs
curl http://localhost:8080/api/test

# Generate ERROR logs
curl http://localhost:8080/api/error

# Generate WARNING logs
curl http://localhost:8080/api/warning
```

### 2. Query Logs in Grafana

Navigate to Grafana > Explore and use LogQL queries:

```logql
# All logs from your application
{job="spring-boot"}

# Only ERROR logs
{job="spring-boot"} |= "ERROR"

# Logs in the last 5 minutes
{job="spring-boot"} [5m]

# Count errors per minute
rate({job="spring-boot"} |= "ERROR" [1m])

# Filter by specific class
{job="spring-boot"} |= "com.yourpackage.YourClass"
```

## 📈 Dashboard Overview

### 1. **Application Overview Dashboard**
- Total log entries per minute
- Log level distribution (pie chart)
- Recent error logs (table view)
- Application uptime

### 2. **Performance Monitoring Dashboard**
- API response time trends
- Request rate per endpoint
- Error rate percentage
- JVM memory usage

### 3. **Error Analysis Dashboard**
- Error count over time
- Top error messages
- Error distribution by severity
- Error trend comparison (day/week/month)

### 4. **System Health Dashboard**
- CPU and memory usage
- Disk I/O metrics
- Network activity
- Thread pool statistics

### Dashboard Screenshots

*(Add screenshots of your dashboards here)*

## 🚨 Alerting

Configured alerts for proactive monitoring:

### Alert Rules

1. **High Error Rate**
   - Condition: Error count > 10 in 5 minutes
   - Severity: Critical
   - Notification: Email/Slack

2. **Application Down**
   - Condition: No logs received in 2 minutes
   - Severity: Critical
   - Notification: Email/Slack/PagerDuty

3. **Memory Threshold**
   - Condition: Memory usage > 85%
   - Severity: Warning
   - Notification: Email

4. **Slow Response Time**
   - Condition: Average response time > 2 seconds
   - Severity: Warning
   - Notification: Slack

### Setting Up Alerts

1. Go to Grafana > Alerting > Alert Rules
2. Create new alert rule
3. Define query and conditions
4. Set notification channel
5. Test and save

## 📁 Project Structure

```
log-visualization-springboot/
│
├── spring-boot-app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/yourpackage/
│   │   │   │       ├── controller/
│   │   │   │       ├── service/
│   │   │   │       └── Application.java
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── logback-spring.xml
│   │   └── test/
│   ├── pom.xml
│   └── Dockerfile
│
├── grafana/
│   ├── dashboards/
│   │   ├── application-overview.json
│   │   ├── performance-monitoring.json
│   │   ├── error-analysis.json
│   │   └── system-health.json
│   └── provisioning/
│       ├── datasources/
│       │   └── loki.yml
│       └── dashboards/
│           └── dashboard.yml
│
├── loki/
│   └── loki-config.yml
│
├── promtail/
│   └── promtail-config.yml
│
├── docker-compose.yml
├── README.md
└── .env.example
```

## 🔧 Troubleshooting

### Logs Not Appearing in Grafana

1. Check if Promtail is running:
   ```bash
   docker-compose ps
   ```

2. Verify Promtail is reading logs:
   ```bash
   docker logs promtail
   ```

3. Check Loki connectivity:
   ```bash
   curl http://localhost:3100/ready
   ```

### High Memory Usage

- Adjust Loki retention period in `loki-config.yml`
- Reduce log verbosity in Spring Boot application
- Increase Docker memory allocation

### Connection Refused Errors

- Ensure all services are on the same Docker network
- Check firewall settings
- Verify port mappings in `docker-compose.yml`

### Dashboard Not Loading Data

1. Verify Loki data source is configured correctly
2. Check time range in dashboard
3. Ensure logs are being generated
4. Test LogQL query in Explore section

## 🔮 Future Enhancements

- [ ] Add Prometheus integration for metrics
- [ ] Implement distributed tracing with Jaeger/Zipkin
- [ ] Create custom log parser for structured logging
- [ ] Add multi-tenancy support
- [ ] Implement log masking for sensitive data
- [ ] Create mobile app for alert notifications
- [ ] Add machine learning for anomaly detection
- [ ] Integrate with APM tools (New Relic, DataDog)
- [ ] Implement log archival to S3/Azure Blob
- [ ] Add support for multiple Spring Boot microservices
- [ ] Create CLI tool for log analysis

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👤 Author

**Your Name**
- GitHub: [@AnshulBhardwaj](https://github.com/anshulbhardwaj123)
- LinkedIn: [AnshulBhardwaj](https://www.linkedin.com/in/anshulbhardwaj1)
- Email: anshul123.124@gmail.com
## 🙏 Acknowledgments

- Grafana Labs for Loki and Grafana
- Spring Boot community
- Docker community for containerization best practices

---

⭐ If you found this project helpful, please give it a star!

**Note**: This is a demonstration project for learning purposes. For production use, ensure proper security configurations, authentication, and resource limits are in place.
