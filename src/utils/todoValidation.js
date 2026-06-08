// shared validation so the form and the edit row agree on what counts
// as a usable todo title (non-empty once whitespace is trimmed)
export function isValidTodoTitle(title) {
  return typeof title === 'string' && title.trim() !== '';
}
