export default function argumentsSlice(...args) {
  try { return args.slice(...this); }
  catch (_) { return []; }
}
