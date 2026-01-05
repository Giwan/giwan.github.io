# Tools System Maintenance Scripts

This directory contains scripts and utilities for maintaining the tools system, ensuring data quality, and automating regular maintenance tasks.

## Available Scripts

### Validation Scripts

#### `validate-tools.js`
Comprehensive validation of tool data structure and consistency.

```bash
# Quick structural validation
npm run validate:tools:quick

# Full validation with consistency checks
npm run validate:tools

# Complete validation including URL accessibility
npm run validate:tools:urls
```

#### `audit-tools.js`
Comprehensive audit of all tools including URL accessibility and quality checks.

```bash
# Run comprehensive tool audit
npm run audit:tools
```

### Maintenance Scripts

#### `maintenance-scheduler.js`
Track and schedule regular maintenance tasks.

```bash
# Show current maintenance status
npm run maintenance:status

# Generate checklist for specific task
npm run maintenance:checklist weekly

# Mark task as completed
npm run maintenance:complete weekly
```

#### `tool-freshness-tracker.js`
Track tool verification dates and identify tools needing review.

```bash
# Generate freshness report
npm run tools:freshness
```

## Maintenance Workflow

### Daily (Automated)
- URL health checks for critical tools
- Build validation
- Performance monitoring

### Weekly (5-10 minutes)
```bash
# 1. Check maintenance status
npm run maintenance:status

# 2. Run quick validation
npm run validate:tools:quick

# 3. Generate weekly checklist
npm run maintenance:checklist weekly

# 4. Complete tasks and mark as done
npm run maintenance:complete weekly
```

### Monthly (30-45 minutes)
```bash
# 1. Generate monthly checklist
npm run maintenance:checklist monthly

# 2. Run comprehensive URL audit
npm run validate:tools:urls

# 3. Check tool freshness
npm run tools:freshness

# 4. Run full audit
npm run audit:tools

# 5. Mark monthly tasks as complete
npm run maintenance:complete monthly
```

### Quarterly (2-3 hours)
```bash
# 1. Generate quarterly checklist
npm run maintenance:checklist quarterly

# 2. Complete comprehensive review
# (Manual process - see checklist)

# 3. Mark quarterly tasks as complete
npm run maintenance:complete quarterly
```

## Output Files

### Generated Reports
- `scripts/audit-report.json` - Detailed audit results
- `scripts/freshness-report.json` - Tool freshness analysis
- `scripts/maintenance-history.json` - Maintenance task completion history

### Report Contents

#### Audit Report
- Tool accessibility status
- Data quality issues
- Recommendations for improvements
- Detailed issue breakdown by type

#### Freshness Report
- Tools never verified
- Stale tools (6+ months since verification)
- Tools needing review (3+ months)
- Summary statistics and recommendations

#### Maintenance History
- Completion dates for all maintenance tasks
- Task scheduling and due dates
- Reminder system for upcoming tasks

## Integration with CI/CD

### Pre-commit Hooks
Add to `.husky/pre-commit`:
```bash
npm run validate:tools:quick
```

### Build Pipeline
Add to GitHub Actions:
```yaml
- name: Validate Tools
  run: npm run validate:tools

- name: Audit Tools
  run: npm run audit:tools
```

### Scheduled Jobs
Add to GitHub Actions for weekly maintenance:
```yaml
- name: Weekly Maintenance Check
  run: |
    npm run validate:tools:urls
    npm run tools:freshness
```

## Customization

### Adding New Validation Rules
1. Modify `validate-tools.js` or create new validation script
2. Add to package.json scripts section
3. Update documentation

### Adding New Maintenance Tasks
1. Modify `MAINTENANCE_SCHEDULE` in `maintenance-scheduler.js`
2. Update maintenance procedures documentation
3. Test new schedule with `npm run maintenance:status`

### Extending Audit Capabilities
1. Modify `audit-tools.js` to add new checks
2. Update report generation logic
3. Test with `npm run audit:tools`

## Troubleshooting

### Common Issues

#### Validation Failures
- Check tool data structure matches TTool interface
- Verify all categories exist in categories.ts
- Ensure all labels exist in labels.ts

#### URL Accessibility Issues
- Check for temporary network issues
- Verify URLs are correct and current
- Look for redirects or site changes

#### Script Execution Errors
- Ensure Node.js version compatibility
- Check file permissions for scripts
- Verify all dependencies are installed

### Getting Help
- Check script output for detailed error messages
- Review generated report files for specific issues
- Consult maintenance documentation for procedures
- Create issue in project repository for persistent problems

## Best Practices

### Regular Maintenance
- Follow the maintenance schedule consistently
- Address validation errors promptly
- Keep tool information current and accurate
- Document any process improvements

### Quality Assurance
- Always run validation after making changes
- Test functionality after adding new tools
- Review audit reports regularly
- Maintain consistent data standards

### Performance Monitoring
- Monitor script execution times
- Watch for performance degradation with tool count growth
- Optimize scripts as needed for larger datasets
- Consider implementing caching for frequently accessed data