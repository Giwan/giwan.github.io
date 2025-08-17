<!------------------------------------------------------------------------------------
   Add Rules to this file or a short description and have Kiro refine them for you:   
-------------------------------------------------------------------------------------> 

## Core Development Principles

- **Clean Architecture**: Write code that is easy to read, understand, and
  maintain
- **Single Responsibility**: Each function and component should have one clear
  purpose
- **Composition over Inheritance**: Favor composable patterns and functional
  approaches
- **Progressive Enhancement**: Build resilient applications that work across
  environments
- **Performance by Design**: Consider performance implications in every decision
- **Type Safety First**: Leverage TypeScript's type system for robust code

## Clean Code Guidelines

### Readability & Maintainability

- **Reduce code repetitation**: Use type aliases, functions, constants etc to minimise strings repeat and repeat functionlity.
- **Meaningful Names**: Use descriptive, intention-revealing names
- **Single Purpose Functions**: Each function should do one thing well
- **Short Functions**: Keep functions under 20 lines when possible
- **Clear Abstractions**: Hide complexity behind well-named interfaces
- **Consistent Formatting**: Use Prettier and ESLint configurations
- **Avoid unnecessary curly braces**: If a line of code can be short without curly braces that should have the preference.
- **Move re-used strings to constants**: Strings re-used in different places should be placed in constants. The constants are then referenced in the code.

### Code Organization

- **Logical Grouping**: Group related functionality together
- **Import Organization**: Group imports by type (external, internal, relative)
- **Export Patterns**: Use named exports, avoid default exports for components
- **File Structure**: Organize files by feature, not by type