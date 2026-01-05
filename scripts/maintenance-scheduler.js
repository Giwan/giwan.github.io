#!/usr/bin/env node

/**
 * Maintenance Scheduler Script
 * 
 * This script helps track and schedule maintenance tasks for the tools system.
 * It provides reminders and tracks completion of regular maintenance activities.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Maintenance schedule configuration
const MAINTENANCE_SCHEDULE = {
    daily: {
        name: 'Daily Tasks',
        frequency: 1, // days
        tasks: [
            'URL health checks (automated)',
            'Build validation (automated)',
            'Performance monitoring (automated)'
        ],
        automated: true
    },
    weekly: {
        name: 'Weekly Tasks',
        frequency: 7, // days
        tasks: [
            'Run quick validation (npm run validate:tools:quick)',
            'Review TODO comments for new tools',
            'Check community feedback and reports',
            'Verify filtering and display performance'
        ],
        estimatedTime: '5-10 minutes',
        automated: false
    },
    monthly: {
        name: 'Monthly Tasks',
        frequency: 30, // days
        tasks: [
            'Run comprehensive URL audit (npm run validate:tools:urls)',
            'Add 3-5 new relevant tools',
            'Review category distribution and balance',
            'Standardize label usage',
            'Update documentation if needed'
        ],
        estimatedTime: '30-45 minutes',
        automated: false
    },
    quarterly: {
        name: 'Quarterly Tasks',
        frequency: 90, // days
        tasks: [
            'Complete tool relevance review',
            'Research new tools and technologies',
            'Assess category structure',
            'Performance optimization review',
            'User experience assessment'
        ],
        estimatedTime: '2-3 hours',
        automated: false
    },
    annual: {
        name: 'Annual Tasks',
        frequency: 365, // days
        tasks: [
            'Complete system overhaul',
            'Technology stack updates',
            'Major category restructuring',
            'Documentation rewrite',
            'Strategic planning'
        ],
        estimatedTime: '4-6 hours',
        automated: false
    }
};

// Maintenance history file
const HISTORY_FILE = path.join(__dirname, 'maintenance-history.json');

/**
 * Load maintenance history
 */
function loadMaintenanceHistory() {
    try {
        if (fs.existsSync(HISTORY_FILE)) {
            const data = fs.readFileSync(HISTORY_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.warn('Could not load maintenance history:', error.message);
    }
    
    return {
        lastUpdated: new Date().toISOString(),
        completedTasks: {},
        reminders: []
    };
}

/**
 * Save maintenance history
 */
function saveMaintenanceHistory(history) {
    try {
        history.lastUpdated = new Date().toISOString();
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
    } catch (error) {
        console.error('Could not save maintenance history:', error.message);
    }
}

/**
 * Calculate next due date for a task
 */
function calculateNextDueDate(lastCompleted, frequency) {
    if (!lastCompleted) {
        return new Date(); // Due now if never completed
    }
    
    const lastDate = new Date(lastCompleted);
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + frequency);
    
    return nextDate;
}

/**
 * Check which tasks are due
 */
function checkDueTasks() {
    const history = loadMaintenanceHistory();
    const now = new Date();
    const dueTasks = [];
    const upcomingTasks = [];
    
    Object.entries(MAINTENANCE_SCHEDULE).forEach(([key, schedule]) => {
        if (schedule.automated) return; // Skip automated tasks
        
        const lastCompleted = history.completedTasks[key];
        const nextDue = calculateNextDueDate(lastCompleted, schedule.frequency);
        const daysUntilDue = Math.ceil((nextDue - now) / (1000 * 60 * 60 * 24));
        
        const taskInfo = {
            key,
            name: schedule.name,
            nextDue: nextDue.toISOString().split('T')[0],
            daysUntilDue,
            estimatedTime: schedule.estimatedTime || 'Variable',
            tasks: schedule.tasks,
            lastCompleted: lastCompleted ? new Date(lastCompleted).toISOString().split('T')[0] : 'Never'
        };
        
        if (daysUntilDue <= 0) {
            dueTasks.push(taskInfo);
        } else if (daysUntilDue <= 7) {
            upcomingTasks.push(taskInfo);
        }
    });
    
    return { dueTasks, upcomingTasks };
}

/**
 * Mark a task as completed
 */
function markTaskCompleted(taskKey) {
    const history = loadMaintenanceHistory();
    
    if (!MAINTENANCE_SCHEDULE[taskKey]) {
        console.error(`Unknown task: ${taskKey}`);
        return false;
    }
    
    history.completedTasks[taskKey] = new Date().toISOString();
    saveMaintenanceHistory(history);
    
    console.log(`✅ Marked "${MAINTENANCE_SCHEDULE[taskKey].name}" as completed`);
    return true;
}

/**
 * Display maintenance status
 */
function displayMaintenanceStatus() {
    const { dueTasks, upcomingTasks } = checkDueTasks();
    
    console.log('🔧 TOOLS MAINTENANCE STATUS');
    console.log('============================\n');
    
    if (dueTasks.length > 0) {
        console.log('🚨 OVERDUE TASKS:\n');
        dueTasks.forEach(task => {
            console.log(`📋 ${task.name}`);
            console.log(`   Due: ${task.nextDue} (${Math.abs(task.daysUntilDue)} days overdue)`);
            console.log(`   Time: ${task.estimatedTime}`);
            console.log(`   Last completed: ${task.lastCompleted}`);
            console.log(`   Tasks:`);
            task.tasks.forEach(t => console.log(`     • ${t}`));
            console.log('');
        });
    }
    
    if (upcomingTasks.length > 0) {
        console.log('⏰ UPCOMING TASKS:\n');
        upcomingTasks.forEach(task => {
            console.log(`📋 ${task.name}`);
            console.log(`   Due: ${task.nextDue} (in ${task.daysUntilDue} days)`);
            console.log(`   Time: ${task.estimatedTime}`);
            console.log(`   Last completed: ${task.lastCompleted}`);
            console.log('');
        });
    }
    
    if (dueTasks.length === 0 && upcomingTasks.length === 0) {
        console.log('✅ All maintenance tasks are up to date!\n');
    }
    
    // Show next scheduled tasks
    console.log('📅 NEXT SCHEDULED TASKS:\n');
    Object.entries(MAINTENANCE_SCHEDULE).forEach(([key, schedule]) => {
        if (schedule.automated) return;
        
        const history = loadMaintenanceHistory();
        const lastCompleted = history.completedTasks[key];
        const nextDue = calculateNextDueDate(lastCompleted, schedule.frequency);
        const daysUntilDue = Math.ceil((nextDue - new Date()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDue > 7) {
            console.log(`   ${schedule.name}: ${nextDue.toISOString().split('T')[0]} (in ${daysUntilDue} days)`);
        }
    });
}

/**
 * Generate maintenance checklist
 */
function generateChecklist(taskKey) {
    const schedule = MAINTENANCE_SCHEDULE[taskKey];
    
    if (!schedule) {
        console.error(`Unknown task: ${taskKey}`);
        return;
    }
    
    console.log(`📋 ${schedule.name.toUpperCase()} CHECKLIST`);
    console.log('='.repeat(schedule.name.length + 12));
    console.log('');
    
    if (schedule.estimatedTime) {
        console.log(`⏱️  Estimated time: ${schedule.estimatedTime}\n`);
    }
    
    console.log('Tasks to complete:\n');
    schedule.tasks.forEach((task, index) => {
        console.log(`${index + 1}. [ ] ${task}`);
    });
    
    console.log('\nAfter completing all tasks, run:');
    console.log(`   node scripts/maintenance-scheduler.js complete ${taskKey}\n`);
}

/**
 * Main function
 */
function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
        case 'status':
        case undefined:
            displayMaintenanceStatus();
            break;
            
        case 'checklist':
            const taskKey = args[1];
            if (!taskKey) {
                console.log('Available tasks:');
                Object.keys(MAINTENANCE_SCHEDULE).forEach(key => {
                    if (!MAINTENANCE_SCHEDULE[key].automated) {
                        console.log(`   ${key} - ${MAINTENANCE_SCHEDULE[key].name}`);
                    }
                });
                console.log('\nUsage: node scripts/maintenance-scheduler.js checklist <task>');
            } else {
                generateChecklist(taskKey);
            }
            break;
            
        case 'complete':
            const completedTask = args[1];
            if (!completedTask) {
                console.log('Usage: node scripts/maintenance-scheduler.js complete <task>');
            } else {
                markTaskCompleted(completedTask);
                console.log('\nUpdated status:');
                displayMaintenanceStatus();
            }
            break;
            
        case 'help':
            console.log('Tools Maintenance Scheduler\n');
            console.log('Commands:');
            console.log('   status              Show current maintenance status (default)');
            console.log('   checklist <task>    Generate checklist for specific task');
            console.log('   complete <task>     Mark task as completed');
            console.log('   help               Show this help message\n');
            console.log('Available tasks:');
            Object.keys(MAINTENANCE_SCHEDULE).forEach(key => {
                if (!MAINTENANCE_SCHEDULE[key].automated) {
                    console.log(`   ${key.padEnd(12)} ${MAINTENANCE_SCHEDULE[key].name}`);
                }
            });
            break;
            
        default:
            console.error(`Unknown command: ${command}`);
            console.log('Run "node scripts/maintenance-scheduler.js help" for usage information');
    }
}

// Run the script
main();