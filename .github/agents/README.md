# Custom Agents Directory

## Overview

This directory contains instructions and configurations for custom agents that can be delegated to handle specific tasks in the wwwr Traffic Management System.

## What are Custom Agents?

Custom agents are specialized, independent software engineering agents with domain-specific knowledge and tools. They are designed to handle particular types of tasks more effectively than general-purpose agents.

## Available Agents

### Cloud Deployment Agent
- **Purpose**: Handles cloud deployment tasks including Vercel, Netlify, GitHub Pages, and Render deployments
- **Configuration**: See `cloud-deployment-agent.md`
- **When to use**: For tasks related to deployment configuration, CI/CD setup, or cloud platform integration

### Database Migration Agent (Planned)
- **Purpose**: Handles migration from localStorage to cloud databases (Firebase, Supabase, MongoDB)
- **When to use**: For tasks related to database schema changes, data migration, or cloud database setup

### Security Audit Agent (Planned)
- **Purpose**: Performs security audits and implements security best practices
- **When to use**: For security reviews, vulnerability assessments, or security feature implementation

## When to Delegate to Custom Agents

### Always Delegate When:
1. The task matches a custom agent's expertise area
2. The task involves complex domain-specific knowledge
3. The task requires specialized tools or configurations
4. Multiple interdependent changes are needed in a specific domain

### How to Delegate:
1. Identify the appropriate custom agent for the task
2. Review the agent's configuration file for requirements
3. Provide complete context, problem statement, and expected outcomes
4. Allow the agent to complete the work independently
5. Accept the agent's work as final (don't review or modify unless it reports failure)

## Agent Development Guidelines

### Creating a New Custom Agent:
1. Create a new `.md` file in this directory with the agent's name
2. Include agent purpose, expertise areas, and capabilities
3. Define clear delegation criteria
4. Specify required context and input format
5. Document expected outputs and success criteria

### Agent Configuration Format:
```markdown
# [Agent Name]

## Purpose
Brief description of the agent's role

## Expertise Areas
- Area 1
- Area 2

## When to Delegate
- Condition 1
- Condition 2

## Required Context
- Context item 1
- Context item 2

## Expected Outcomes
- Outcome 1
- Outcome 2

## Example Usage
Example scenarios where this agent should be used
```

## Important Notes

⚠️ **Note**: According to system policies, custom agents' instruction files in this directory should not be read or modified by general-purpose agents. These files contain specialized instructions for their respective agents.

## Integration with Copilot

Custom agents work alongside GitHub Copilot to provide specialized capabilities. The main copilot-instructions.md file contains general guidelines, while agent-specific instructions are kept separate in this directory.

---

**Last Updated**: 2025-11-14  
**Maintainer**: AI Coding Agents Team
