// src/index.ts

// Missing return type (your config disables explicit return type check, so no error here)

// But this will cause an immediate error:
// Using console.log is usually allowed unless disabled, so let's try:

// Example of a syntax error ESLint will catch immediately:
const number: number = 'string'; // Type error — assigning string to number

// Or force a rule error like using `var` if your config forbids it:
const x = 10; // 'var' usage error if eslint:recommended is enabled

// Or example with prettier error: double quotes vs single quotes (if prettier enforces single quotes)
console.log('Hello'); // should be 'Hello'

// Or using 'any' type if your config forbids it (depends on your eslint rules)
function test(x: any) {
  return x;
}

// Or unused variable without underscore:
const unused = 42; // should show error or warning

// Try this to get a real ESLint error:

function add(a: number, b: number) {
  return a + b;
}

add(2, '3'); // Passing string instead of number — will cause a TypeScript error, but ESLint usually won't catch TS type errors without extra setup
