# Git Workflow Guide - Handling Uncommitted Changes

## Overview
This guide explains how to handle uncommitted changes in the repository and when it's safe to proceed.

## Checking for Uncommitted Changes

### Using the Helper Script
```bash
./check-changes.sh
```

This will:
- Check if there are any uncommitted changes
- Display the status of modified files
- Prompt you to proceed or abort

### Force Proceeding
If you're confident about proceeding with uncommitted changes:
```bash
./check-changes.sh --force
```

### Manual Check
```bash
# Check working directory status
git status

# Check for uncommitted changes
git diff

# Check for staged but uncommitted changes
git diff --cached
```

## When to Proceed with Uncommitted Changes

### ✅ Safe to Proceed:
- Development and testing environments
- Local feature development
- Experimental changes
- Work in progress on a feature branch

### ⚠️ Proceed with Caution:
- Before deployment
- Before merging to main/master
- Before creating a release
- When working on critical features

### ❌ Do NOT Proceed:
- Production deployments
- When changes could break the build
- When changes haven't been reviewed
- Before backing up important work

## Best Practices

### 1. Commit Frequently
```bash
git add .
git commit -m "Descriptive commit message"
```

### 2. Use Stash for Temporary Storage
```bash
# Save uncommitted changes
git stash

# Work on something else...

# Restore your changes
git stash pop
```

### 3. Create Feature Branches
```bash
# Create and switch to a new branch
git checkout -b feature/my-feature

# Make your changes and commit
git add .
git commit -m "Add new feature"
```

### 4. Review Changes Before Committing
```bash
# See what files have changed
git status

# See the actual changes
git diff

# Review staged changes
git diff --cached
```

## File Exclusions

The `.gitignore` file is configured to exclude:
- Binary files (images, archives)
- Temporary files
- Build artifacts
- Configuration files with sensitive data
- IDE-specific files

If you need to track a file that's being ignored:
```bash
# Force add an ignored file
git add -f path/to/file

# Or update .gitignore
```

## Troubleshooting

### "Uncommitted changes detected" Error
1. Check what files have changed: `git status`
2. Decide if changes should be committed or discarded
3. Use the check-changes script: `./check-changes.sh`
4. If safe, proceed with `--force` flag

### Discard All Uncommitted Changes
```bash
# Discard changes in working directory
git checkout -- .

# Discard staged changes
git reset HEAD

# Discard all (including untracked files)
git clean -fd
```

### Keep Changes for Later
```bash
git stash save "Work in progress on feature X"
```

## Environment-Specific Guidance

### Development
- Uncommitted changes are normal
- Commit when a logical unit of work is complete
- Use descriptive commit messages

### Staging/Testing
- Ensure all changes are committed
- Use tagged releases
- Document what's being tested

### Production
- Never deploy with uncommitted changes
- Always use tagged, reviewed releases
- Maintain clean deployment branches

## مسموح اكمل (Permission to Proceed)
When you receive permission to proceed despite uncommitted changes, you can:
1. Use the `--force` flag: `./check-changes.sh --force`
2. Acknowledge that changes are intentional and won't cause issues
3. Document why proceeding is safe in this case
4. Consider committing changes to a feature branch

## Support
For questions or issues related to git workflow, consult:
- Git documentation: https://git-scm.com/doc
- Project maintainers
- Development team leads
