
# Incident Response Runbook

## Severity Levels

### P0 - Critical (Site Down)
- **Response Time**: Immediate (< 15 minutes)
- **Examples**: Complete site outage, data loss, security breach
- **Escalation**: Page on-call immediately

### P1 - High (Major Feature Down) 
- **Response Time**: < 1 hour
- **Examples**: Search not working, login issues, payment failures
- **Escalation**: Notify on-call within 30 minutes

### P2 - Medium (Degraded Performance)
- **Response Time**: < 4 hours
- **Examples**: Slow page loads, intermittent errors
- **Escalation**: Create ticket, normal business hours

### P3 - Low (Minor Issues)
- **Response Time**: < 24 hours  
- **Examples**: UI glitches, non-critical features
- **Escalation**: Normal ticket process

## On-Call Procedures

### Initial Response (First 15 minutes)
1. **Acknowledge** the alert in monitoring system
2. **Assess** severity using levels above
3. **Create** incident channel: `#incident-YYYY-MM-DD-HHMM`
4. **Post** initial status update
5. **Begin** investigation

### Investigation Steps
1. **Check service status**: `/api/health`
2. **Review recent deployments**: Last 2 hours
3. **Check logs**: 
   - Application logs: `docker logs beedab-app`
   - Database logs: Check PostgreSQL status
   - Error monitoring: Review Sentry/monitoring dashboards
4. **Verify external dependencies**:
   - Database connectivity
   - Third-party APIs (Google Maps, etc.)

### Communication

#### Internal Updates (Every 30 minutes)
```
**Status**: Investigating/Identified/Mitigating/Resolved
**Impact**: X users affected, Y functionality impacted  
**ETA**: Expected resolution time
**Next Update**: When next update will be posted
```

#### External Communication
- **P0/P1**: Update status page within 30 minutes
- **All**: Post-incident review within 24 hours

## Common Issues & Solutions

### Database Connection Issues
```bash
# Check database status
docker exec -it postgres pg_isready -U beedab

# Check connection pool
npx tsx scripts/health-check.ts

# Restart database (last resort)
docker compose restart db
```

### High Memory Usage
```bash
# Check memory usage
docker stats

# Review Node.js heap
node --inspect server/index.ts
```

### Search Not Working
```bash
# Check search endpoint
curl https://your-domain.com/api/search?query=test

# Verify database indexes
npx tsx scripts/check-db-indexes.ts
```

## Rollback Procedures

### Application Rollback
```bash
# Identify last good commit
git log --oneline -10

# Create rollback branch  
git checkout -b rollback-to-COMMIT_HASH

# Deploy previous version
npm run build
# Deploy via your CI/CD process
```

### Database Rollback
```bash
# DANGEROUS - Only for emergencies
# Backup current state first
pg_dump -U beedab beedab_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Rollback migration (if recent migration caused issue)
npx drizzle-kit drop
# Re-apply previous migration
```

## Log Locations

### Application Logs
- **Development**: Console output
- **Production**: Structured JSON logs to stdout
- **Errors**: Sentry dashboard

### Database Logs  
- **PostgreSQL**: Docker logs or configured log destination
- **Slow queries**: Check `log_slow_queries` setting

### Infrastructure Logs
- **Web server**: Nginx/Apache logs if applicable
- **System**: Docker logs, system metrics

## Recovery Verification

After resolving incident:

1. **Verify core functionality**:
   - [ ] User registration/login
   - [ ] Property search  
   - [ ] Map rendering
   - [ ] API health checks

2. **Check metrics**:
   - [ ] Response times back to normal
   - [ ] Error rates < 1%
   - [ ] Database connections stable

3. **Monitor for 2 hours** for any regression

## Post-Incident Process

### Immediate (< 2 hours)
- [ ] Update status page to "Resolved"
- [ ] Close incident channel with summary
- [ ] Create post-incident review document

### Within 24 hours  
- [ ] Conduct blameless post-mortem
- [ ] Identify root cause
- [ ] Create action items to prevent recurrence
- [ ] Update runbooks if needed

### Within 1 week
- [ ] Implement preventive measures
- [ ] Update monitoring/alerting if gaps identified
- [ ] Share learnings with team

## Emergency Contacts

- **On-call Engineer**: Check PagerDuty/on-call schedule
- **Tech Lead**: @cbadabili
- **Database Admin**: TBD
- **Infrastructure**: TBD

## Useful Commands

```bash
# Quick health checks
npm run health-check
curl https://your-domain.com/api/health

# Database quick checks  
npx tsx scripts/check-user.ts
npx tsx scripts/test-properties-api.ts

# Performance monitoring
npm run performance-monitor

# Security checks
npm run check-security
```
